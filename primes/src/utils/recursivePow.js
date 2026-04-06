/**
 * Recursive powering: x^n using halving for even n and reduction for odd n.
 * @param {number|string} x
 * @param {number|string} n — nonnegative integer exponent
 * @returns {{ result: number, steps: string[], error: null } | { result: null, steps: string[], error: string }}
 */
export function recursivePow(x, n) {
  const xNum = Number(x);
  const nRaw = Number(n);
  const nInt = Math.trunc(nRaw);

  if (!Number.isFinite(xNum) || !Number.isFinite(nRaw)) {
    return {
      error: 'Enter valid numbers for x and n.',
      steps: [],
      result: null,
    };
  }

  if (nInt < 0 || nRaw !== nInt) {
    return {
      error: 'n must be a nonnegative integer.',
      steps: [],
      result: null,
    };
  }

  const steps = [];

  function rec(base, exp, depth) {
    const ind = '  '.repeat(depth);
    if (exp === 0) {
      steps.push(`${ind}pow(${base}, 0) = 1  (base case)`);
      return 1;
    }
    if (exp % 2 === 1) {
      steps.push(
        `${ind}pow(${base}, ${exp}): n is odd → ${base} × pow(${base}, ${exp - 1})`
      );
      return base * rec(base, exp - 1, depth + 1);
    }
    const nextBase = base * base;
    const nextExp = exp / 2;
    steps.push(
      `${ind}pow(${base}, ${exp}): n is even → pow(${base}², ${nextExp}) = pow(${nextBase}, ${nextExp})`
    );
    return rec(nextBase, nextExp, depth + 1);
  }

  const result = rec(xNum, nInt, 0);
  steps.push(`Result: ${xNum}^${nInt} = ${result}`);

  return { result, steps, error: null };
}
