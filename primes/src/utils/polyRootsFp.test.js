import { MAX_P_POLY_ROOTS, rootsPolynomialFp } from './polyRootsFp';

describe('rootsPolynomialFp', () => {
  it('finds roots of x^2 - 1 in F_5', () => {
    const r = rootsPolynomialFp('5', 'x^2 - 1');
    expect(r.error).toBeNull();
    expect(r.roots).toEqual([1, 4]);
    expect(r.fText).toMatch(/x\^2/);
  });

  it('finds roots of x^2 + 1 in F_5', () => {
    const r = rootsPolynomialFp('5', 'x^2 + 1');
    expect(r.error).toBeNull();
    expect(r.roots).toEqual([2, 3]);
  });

  it('returns empty when there are no roots', () => {
    const r = rootsPolynomialFp('5', 'x^2 + 2');
    expect(r.error).toBeNull();
    expect(r.roots).toEqual([]);
  });

  it('rejects composite p', () => {
    const r = rootsPolynomialFp('6', 'x+1');
    expect(r.error).toMatch(/prime/i);
  });

  it('rejects p above brute-force limit', () => {
    const r = rootsPolynomialFp(String(MAX_P_POLY_ROOTS + 1), 'x');
    expect(r.error).toMatch(/at most/i);
  });
});
