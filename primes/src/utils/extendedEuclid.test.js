import { extendedEuclid } from './extendedEuclid';

describe('extendedEuclid', () => {
  it('returns gcd and Bézout coefficients for 35 and 15', () => {
    const r = extendedEuclid(35, 15);
    expect(r.error).toBeNull();
    expect(r.gcd).toBe(5);
    expect(r.x * 35 + r.y * 15).toBe(5);
  });

  it('handles negatives by adjusting signs', () => {
    const r = extendedEuclid(-35, 15);
    expect(r.error).toBeNull();
    expect(r.gcd).toBe(5);
    expect(-35 * r.x + 15 * r.y).toBe(5);
  });

  it('returns error for 0 and 0', () => {
    const r = extendedEuclid(0, 0);
    expect(r.error).toBeTruthy();
    expect(r.gcd).toBeNull();
  });

  it('handles gcd when a is 0', () => {
    const r = extendedEuclid(0, 7);
    expect(r.error).toBeNull();
    expect(r.gcd).toBe(7);
    expect(0 * r.x + 7 * r.y).toBe(7);
  });

  it('includes step lines', () => {
    const r = extendedEuclid(35, 15);
    expect(r.steps.length).toBeGreaterThan(0);
    expect(r.steps.some((line) => /Step 1/.test(line))).toBe(true);
  });
});
