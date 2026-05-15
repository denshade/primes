/* global BigInt */

/**
 * Recursive powering: x^n using halving for even n and reduction for odd n.
 * @param {number|string|bigint} x
 * @param {number|string|bigint} n — nonnegative integer exponent
 * @returns {{ result: bigint, steps: string[], error: null } | { result: null, steps: string[], error: string }}
 */
export function recursivePow(x, n) {
  let base;
  let exp;
  try {
    base = BigInt(x);
    exp = BigInt(n);
  } catch {
    return {
      error: 'Enter valid integers for x and n.',
      steps: [],
      result: null,
    };
  }

  if (typeof n === 'number' && Number.isFinite(n) && !Number.isInteger(n)) {
    return {
      error: 'n must be a nonnegative integer.',
      steps: [],
      result: null,
    };
  }

  if (exp < 0n) {
    return {
      error: 'n must be a nonnegative integer.',
      steps: [],
      result: null,
    };
  }

  const steps = [];

  function rec(b, e, depth) {
    const ind = '  '.repeat(depth);
    if (e === 0n) {
      steps.push(`${ind}pow(${b}, 0) = 1  (base case)`);
      return 1n;
    }
    if (e % 2n === 1n) {
      steps.push(
        `${ind}pow(${b}, ${e}): n is odd → ${b} × pow(${b}, ${e - 1n})`
      );
      return b * rec(b, e - 1n, depth + 1);
    }
    const nextBase = b * b;
    const nextExp = e / 2n;
    steps.push(
      `${ind}pow(${b}, ${e}): n is even → pow(${b}², ${nextExp}) = pow(${nextBase}, ${nextExp})`
    );
    return rec(nextBase, nextExp, depth + 1);
  }

  const result = rec(base, exp, 0);
  steps.push(`Result: ${base}^${exp} = ${result}`);

  return { result, steps, error: null };
}
