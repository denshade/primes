import {
  modP,
  polyEqualFp,
  polyEvalFp,
  polyMulFp,
  polyPowModFp,
  polyRemFp,
  trimFp,
} from './fpPolynomial';

describe('fpPolynomial', () => {
  it('multiplies and reduces mod p', () => {
    const p = 5;
    const a = [1, 1];
    const b = [1, 1];
    expect(polyMulFp(a, b, p)).toEqual(trimFp([1, 2, 1], p));
  });

  it('evaluates at x in F_p (Horner)', () => {
    const p = 7;
    const f = [2, 0, 1];
    expect(polyEvalFp(f, 3, p)).toBe(modP(2 + 9, p));
    expect(polyEvalFp([], 5, p)).toBe(0);
  });

  it('powmods x^p^n mod f', () => {
    const p = 2;
    const f = [1, 1, 1];
    const x = [0, 1];
    const r = polyPowModFp(x, 4n, f, p);
    expect(polyEqualFp(r, x, p)).toBe(true);
  });
});
