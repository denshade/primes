import { recursivePow } from './recursivePow';

describe('recursivePow', () => {
  it('computes small powers', () => {
    expect(recursivePow(2, 10).result).toBe(1024n);
    expect(recursivePow(3, 4).result).toBe(81n);
  });

  it('uses exponent 0', () => {
    expect(recursivePow(5, 0).result).toBe(1n);
  });

  it('handles negative base', () => {
    expect(recursivePow(-2, 3).result).toBe(-8n);
  });

  it('handles large exponents without overflow', () => {
    expect(recursivePow(2, 100).result).toBe(1267650600228229401496703205376n);
  });

  it('does not lose precision like Number exponentiation', () => {
    const expected = 3n ** 40n;
    const { result, error } = recursivePow(3, 40);

    expect(error).toBeNull();
    expect(result).toBe(expected);
    expect(result > BigInt(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(BigInt(Number(3) ** 40)).not.toBe(expected);
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
