/* eslint-env jest */
/* Simple branch tests for the image proxy route */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const routeModule = require('./route');
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const routeGET = routeModule.GET as Function;

// only define minimal polyfills if they don't already exist (avoid duplicate identifiers across test files)
if (!(global as any).Headers) {
  const LocalHeaders = class {
    private map = new Map<string, string>();
    constructor(init?: Record<string, string>) {
      if (init) Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), v));
    }
    get(k: string) {
      return this.map.get(k.toLowerCase()) ?? null;
    }
    set(k: string, v: string) {
      this.map.set(k.toLowerCase(), String(v));
    }
  };
  (global as any).Headers = LocalHeaders;
}

if (!(global as any).Response) {
  const LocalResponse = class {
    status: number;
    headers: any;
    private body: any;
    constructor(body: any, init?: { status?: number; headers?: any }) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = init?.headers ?? new (global as any).Headers();
    }
    async arrayBuffer() {
      if (this.body instanceof Uint8Array) return this.body.buffer;
      if (this.body?.buffer) return this.body.buffer;
      return new ArrayBuffer(0);
    }
    async text() {
      if (typeof this.body === 'string') return this.body;
      return '';
    }
  };
  (global as any).Response = LocalResponse;
}

describe('GET /api/image branches', () => {
  let originalFetch: any;
  beforeEach(() => {
    originalFetch = global.fetch;
  });
  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('passes through upstream non-ok status', async () => {
    const upstream = { ok: false, status: 404, headers: { get: () => null } } as any;
    global.fetch = jest.fn().mockResolvedValueOnce(upstream);

    const req = { url: 'http://localhost/api/image?path=/t/p/w500/notfound.jpg' } as any;
  const res = await routeGET(req);
    expect(res.status).toBe(404);
  });

  it('uses src parameter when provided', async () => {
    // Ensure fetch is called with the src url
    const called: string[] = [];
    global.fetch = jest.fn().mockImplementation(async (u: string) => {
      called.push(String(u));
      return { ok: true, headers: { get: () => 'image/png' }, arrayBuffer: async () => new Uint8Array([1, 2]).buffer } as any;
    });

    const src = 'https://example.com/pic.png';
    const req = { url: `http://localhost/api/image?src=${encodeURIComponent(src)}` } as any;
  const res = await routeGET(req);
    expect(res.status).toBe(200);
    expect(called[0]).toBe(src);
  });

  it('returns 500 on unexpected fetch error', async () => {
    global.fetch = jest.fn().mockImplementation(() => {
      throw new Error('boom fetch');
    });
    const req = { url: 'http://localhost/api/image?path=/t/p/w500/test.jpg' } as any;
  const res = await routeGET(req);
    expect(res.status).toBe(500);
    const text = await res.text();
    expect(text).toContain('boom');
  });
});
