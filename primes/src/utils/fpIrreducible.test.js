import { irreducibilityTestFp } from './fpIrreducible';

describe('irreducibilityTestFp', () => {
  it('detects irreducible quadratic over F_2', () => {
    const r = irreducibilityTestFp(2, 'x^2+x+1');
    expect(r.error).toBeNull();
    expect(r.irreducible).toBe(true);
  });

  it('detects reducible polynomial over F_5', () => {
    const r = irreducibilityTestFp(5, 'x^2+1');
    expect(r.error).toBeNull();
    expect(r.irreducible).toBe(false);
  });

  it('detects irreducible quadratic over F_5', () => {
    const r = irreducibilityTestFp(5, 'x^2+2');
    expect(r.error).toBeNull();
    expect(r.irreducible).toBe(true);
  });

  it('rejects non-prime p', () => {
    const r = irreducibilityTestFp(4, 'x^2+1');
    expect(r.error).toMatch(/prime/i);
  });

  it('rejects degree less than 2', () => {
    const r = irreducibilityTestFp(3, 'x+1');
    expect(r.error).toMatch(/at least 2/i);
  });
});
