import { getProxyImageUrlForPath, getProxyImageUrlForSrc } from './imageUrl';

describe('imageUrl helpers', () => {
  it('returns undefined for empty inputs', () => {
    expect(getProxyImageUrlForPath(undefined)).toBeUndefined();
    expect(getProxyImageUrlForSrc(null)).toBeUndefined();
  });

  it('builds proxy path correctly with leading slash', () => {
    const res = getProxyImageUrlForPath('/abc.jpg', 'w92');
    expect(res).toContain('/api/image?path=%2Ft%2Fp%2Fw92%2F%2Fabc.jpg'.replace('%2F%2F', '%2F'));
  });

  it('builds proxy src correctly', () => {
    const res = getProxyImageUrlForSrc('https://example.com/image.png');
    expect(res).toBe('/api/image?src=https%3A%2F%2Fexample.com%2Fimage.png');
  });
});
