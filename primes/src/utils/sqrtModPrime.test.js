import { sqrtModPrime } from './sqrtModPrime';

describe('sqrtModPrime', () => {
  it('returns ±3 for a=2, p=7', () => {
    const r = sqrtModPrime(2, 7);
    expect(r.error).toBeNull();
    expect(r.roots.map((x) => Number(x)).sort((a, b) => a - b)).toEqual([3, 4]);
  });

  it('returns ±1 for a=1, p=7', () => {
    const r = sqrtModPrime(1, 7);
    expect(r.error).toBeNull();
    expect(r.roots.map((x) => Number(x)).sort((a, b) => a - b)).toEqual([1, 6]);
  });

  it('handles p ≡ 1 (mod 4): a=2, p=17', () => {
    const r = sqrtModPrime(2, 17);
    expect(r.error).toBeNull();
    const nums = r.roots.map((x) => Number(x)).sort((a, b) => a - b);
    expect(nums).toEqual([6, 11]);
    expect((nums[0] * nums[0]) % 17).toBe(2);
  });

  it('rejects composite p', () => {
    const r = sqrtModPrime(2, 15);
    expect(r.roots).toBeNull();
    expect(r.error).toMatch(/prime/i);
  });

  it('rejects when (a/p) ≠ 1', () => {
    const r = sqrtModPrime(3, 7);
    expect(r.roots).toBeNull();
    expect(r.error).toMatch(/Jacobi|quadratic residue/i);
  });

  it('rejects even p', () => {
    const r = sqrtModPrime(1, 4);
    expect(r.roots).toBeNull();
    expect(r.error).toMatch(/odd|prime/i);
  });

  it('rejects p ≥ 2^64', () => {
    const r = sqrtModPrime(2, (1n << 64n) + 9n);
    expect(r.roots).toBeNull();
    expect(r.error).toMatch(/2\^64|64/i);
  });
});
