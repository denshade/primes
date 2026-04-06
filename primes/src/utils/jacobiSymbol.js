/* global BigInt */

/**
 * Jacobi symbol (a/n) for odd positive integer n ≥ 3.
 * When n is an odd prime, this equals the Legendre symbol.
 * Returns -1, 0, or 1.
 * @param {number|string|bigint} a
 * @param {number|string|bigint} n
 */
export function jacobiSymbol(a, n) {
  let N;
  let A;
  try {
    N = BigInt(n);
    A = BigInt(a);
  } catch {
    return { error: 'a and p must be integers.', value: null };
  }

  if (N < 3n) {
    return {
      error: 'p must be an odd integer ≥ 3.',
      value: null,
    };
  }
  if (N % 2n === 0n) {
    return {
      error: 'p must be odd (Jacobi symbol requires an odd denominator).',
      value: null,
    };
  }

  A = ((A % N) + N) % N;
  let t = 1n;
  while (A !== 0n) {
    while (A % 2n === 0n) {
      A /= 2n;
      const r = N % 8n;
      if (r === 3n || r === 5n) {
        t = -t;
      }
    }
    const tmp = A;
    A = N;
    N = tmp;
    if (A % 4n === 3n && N % 4n === 3n) {
      t = -t;
    }
    A %= N;
  }

  const value = N === 1n ? Number(t) : 0;
  if (value !== -1 && value !== 0 && value !== 1) {
    return { error: 'Unexpected result.', value: null };
  }
  return { error: null, value };
}
