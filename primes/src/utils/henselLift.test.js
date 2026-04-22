import { henselLiftPolynomial, integerPolyToString } from './henselLift';

describe('henselLiftPolynomial', () => {
  it('lifts sqrt(2): x^2 - 2 mod 7 from r0=3 to mod 49', () => {
    const r = henselLiftPolynomial('7', 'x^2 - 2', '3', '2');
    expect(r.error).toBeNull();
    expect(r.r).toBe('10');
    expect(r.modulus).toBe('49');
    expect(r.steps.some((s) => s.includes('p^2'))).toBe(true);
  });

  it('continues lift to mod 343', () => {
    const r = henselLiftPolynomial('7', 'x^2 - 2', '3', '3');
    expect(r.error).toBeNull();
    expect(r.r).toBe('108');
    expect(r.modulus).toBe('343');
  });

  it('returns r0 mod p when k=1', () => {
    const r = henselLiftPolynomial('7', 'x^2 - 2', '3', '1');
    expect(r.error).toBeNull();
    expect(r.r).toBe('3');
    expect(r.modulus).toBe('7');
  });

  it('rejects when f(r0) not 0 mod p', () => {
    const r = henselLiftPolynomial('7', 'x^2 - 2', '2', '2');
    expect(r.error).toMatch(/f\(r/);
  });

  it('rejects singular derivative mod p', () => {
    const r = henselLiftPolynomial('3', 'x^2', '0', '2');
    expect(r.error).toMatch(/f'\(r/);
  });

  it('rejects composite p', () => {
    const r = henselLiftPolynomial('6', 'x - 1', '1', '2');
    expect(r.error).toMatch(/prime/i);
  });
});

describe('integerPolyToString', () => {
  it('formats a quadratic', () => {
    expect(integerPolyToString([-2n, 0n, 1n])).toMatch(/x\^2/);
  });
});
