import {
  modP,
  polyEqualFp,
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

  it('powmods x^p^n mod f', () => {
    const p = 2;
    const f = [1, 1, 1];
    const x = [0, 1];
    const r = polyPowModFp(x, 4n, f, p);
    expect(polyEqualFp(r, x, p)).toBe(true);
  });
});
