// Minimal polyfills for Response and Headers so the route code (which uses
// the Web Fetch Response/Headers API) can run inside Jest's Node environment.
class MockHeaders {
  private map = new Map<string, string>()
  constructor(init?: Record<string, string>) {
    if (init) Object.entries(init).forEach(([k, v]) => this.map.set(k.toLowerCase(), v))
  }
  get(k: string) {
    return this.map.get(k.toLowerCase()) ?? null
  }
  set(k: string, v: string) {
    this.map.set(k.toLowerCase(), String(v))
  }
}

class MockResponse {
  status: number
  headers: MockHeaders
  private body: any
  constructor(body: any, init?: { status?: number; headers?: any }) {
    this.body = body
    this.status = init?.status ?? 200
    this.headers = init?.headers ?? new MockHeaders()
  }
  async arrayBuffer() {
    if (this.body instanceof Uint8Array) return this.body.buffer
    if (this.body?.buffer) return this.body.buffer
    return new ArrayBuffer(0)
  }
  async text() {
    if (typeof this.body === 'string') return this.body
    return ''
  }
}

;(global as any).Headers = MockHeaders
;(global as any).Response = MockResponse

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type
const { GET } = require('./route') as { GET: Function }

describe('GET /api/image', () => {
  const originalFetch = global.fetch

  afterEach(() => {
    global.fetch = originalFetch
    jest.resetAllMocks()
  })

  it('returns 400 when no query params provided', async () => {
    const req = { url: 'http://localhost/api/image' } as any
    const res = await GET(req)
    expect(res.status).toBe(400)
    const text = await res.text()
    expect(text).toMatch(/Missing query parameter/i)
  })

  it('fetches image from upstream and caches it (miss then hit)', async () => {
    const imgBytes = new Uint8Array([1, 2, 3])

    // Mock upstream fetch for the first call
    const upstreamResponse = {
      ok: true,
      status: 200,
      headers: {
        get: (k: string) => (k.toLowerCase() === 'content-type' ? 'image/jpeg' : null),
      },
      arrayBuffer: async () => imgBytes.buffer,
    }

    const fetchMock = jest.fn().mockResolvedValue(upstreamResponse as any)
    global.fetch = fetchMock as any

    const url = 'http://localhost/api/image?path=/t/p/w500/test.jpg'
    const req1 = { url } as any

    const res1 = await GET(req1)
    expect(res1.status).toBe(200)
    expect(res1.headers.get('X-Cache-Hit')).toBe('0')
    expect(res1.headers.get('Content-Type')).toBe('image/jpeg')
    const body1 = new Uint8Array(await res1.arrayBuffer())
    expect(Array.from(body1)).toEqual(Array.from(imgBytes))

    // Ensure fetch was called once
    expect(fetchMock).toHaveBeenCalledTimes(1)

    // Now subsequent request should hit cache. Make fetch throw if called again to ensure it's not used.
    global.fetch = jest.fn(() => { throw new Error('upstream fetch should not be called on cache hit') }) as any

    const req2 = { url } as any
    const res2 = await GET(req2)
    expect(res2.status).toBe(200)
    expect(res2.headers.get('X-Cache-Hit')).toBe('1')
    const body2 = new Uint8Array(await res2.arrayBuffer())
    expect(Array.from(body2)).toEqual(Array.from(imgBytes))
  })
})
