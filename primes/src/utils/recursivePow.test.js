import { recursivePow } from './recursivePow';

describe('recursivePow', () => {
  it('computes small powers', () => {
    expect(recursivePow(2, 10).result).toBe(1024);
    expect(recursivePow(3, 4).result).toBe(81);
  });

  it('uses exponent 0', () => {
    expect(recursivePow(5, 0).result).toBe(1);
  });

  it('handles negative base', () => {
    expect(recursivePow(-2, 3).result).toBe(-8);
  });

  it('returns error for negative n', () => {
    const r = recursivePow(2, -1);
    expect(r.error).toBeTruthy();
    expect(r.result).toBeNull();
  });

  it('returns error for non-integer n', () => {
    const r = recursivePow(2, 2.5);
    expect(r.error).toBeTruthy();
  });

  it('records steps', () => {
    const r = recursivePow(2, 4);
    expect(r.steps.length).toBeGreaterThan(0);
    expect(r.steps.some((line) => /pow\(/.test(line))).toBe(true);
  });
});
