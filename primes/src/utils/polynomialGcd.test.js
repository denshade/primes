import {
  parsePolynomial,
  polynomialGcd,
  polynomialExtendedGcd,
} from './polynomialGcd';

describe('parsePolynomial', () => {
  it('parses typical polynomial text', () => {
    const parsed = parsePolynomial('x^2 - 3x + 2');
    expect(parsed.error).toBeNull();
    expect(parsed.poly).toEqual([2, -3, 1]);
  });

  it('rejects invalid term format', () => {
    const parsed = parsePolynomial('x^^2 + 1');
    expect(parsed.error).toBeTruthy();
  });
});

describe('polynomialExtendedGcd', () => {
  it('finds gcd(x^2-3x+2, x^2-1) = x-1 and Bézout coefficients', () => {
    const r = polynomialExtendedGcd('x^2 - 3x + 2', 'x^2 - 1');
    expect(r.error).toBeNull();
    expect(r.dText).toBe('x - 1');
    expect(r.uText).toBeTruthy();
    expect(r.vText).toBeTruthy();
  });

  it('returns 1 for coprime polynomials', () => {
    const r = polynomialExtendedGcd('x^2 + 1', 'x + 1');
    expect(r.error).toBeNull();
    expect(r.dText).toBe('1');
  });

  it('returns non-zero polynomial if one input is zero', () => {
    const r = polynomialExtendedGcd('0', 'x^2 - 4');
    expect(r.error).toBeNull();
    expect(r.dText).toBe('x^2 - 4');
    expect(r.uText).toBe('0');
    expect(r.vText).toBe('1');
  });
});

describe('polynomialGcd alias', () => {
  it('matches extended gcd', () => {
    const a = polynomialGcd('x^2 - 3x + 2', 'x^2 - 1');
    const b = polynomialExtendedGcd('x^2 - 3x + 2', 'x^2 - 1');
    expect(a.dText).toBe(b.dText);
    expect(a.uText).toBe(b.uText);
  });
});
