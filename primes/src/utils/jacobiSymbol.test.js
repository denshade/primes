import { jacobiSymbol } from './jacobiSymbol';

describe('jacobiSymbol', () => {
  it('computes Legendre (2/7) = 1', () => {
    const r = jacobiSymbol(2, 7);
    expect(r.error).toBeNull();
    expect(r.value).toBe(1);
  });

  it('computes (3/7) = -1', () => {
    const r = jacobiSymbol(3, 7);
    expect(r.error).toBeNull();
    expect(r.value).toBe(-1);
  });

  it('returns 0 when gcd(a,p) > 1', () => {
    const r = jacobiSymbol(6, 15);
    expect(r.error).toBeNull();
    expect(r.value).toBe(0);
  });

  it('rejects even p', () => {
    const r = jacobiSymbol(1, 8);
    expect(r.error).toBeTruthy();
  });
});
