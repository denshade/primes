import { parsePolynomial } from './polynomialGcd';
import {
  fpPolyToString,
  isZeroFp,
  modP,
  polyEvalFp,
  trimFp,
} from './fpPolynomial';

/** Brute force over all field elements; keep p modest. */
export const MAX_P_POLY_ROOTS = 100_000;

function isPrime(n) {
  if (n < 2) {
    return false;
  }
  if (n === 2) {
    return true;
  }
  if (n % 2 === 0) {
    return false;
  }
  for (let d = 3; d * d <= n; d += 2) {
    if (n % d === 0) {
      return false;
    }
  }
  return true;
}

/**
 * All roots of f in F_p (listed in increasing order) by testing x = 0,…,p−1.
 * @returns {{ error: string, roots: null, fText: null, p: null } | { error: null, roots: number[], fText: string, p: number }}
 */
export function rootsPolynomialFp(pInput, fInput) {
  const p = parseInt(String(pInput).trim(), 10);
  if (!Number.isFinite(p) || p < 2) {
    return {
      error: 'p must be an integer ≥ 2.',
      roots: null,
      fText: null,
      p: null,
    };
  }
  if (p > MAX_P_POLY_ROOTS) {
    return {
      error: `p must be at most ${MAX_P_POLY_ROOTS} (exhaustive search over F_p).`,
      roots: null,
      fText: null,
      p: null,
    };
  }
  if (!isPrime(p)) {
    return { error: 'p must be prime.', roots: null, fText: null, p: null };
  }

  const parsed = parsePolynomial(fInput);
  if (parsed.error) {
    return { error: parsed.error, roots: null, fText: null, p: null };
  }

  const f = trimFp(
    parsed.poly.map((c) => modP(Math.round(Number(c)), p)),
    p
  );

  if (isZeroFp(f, p)) {
    return {
      error: 'f(x) cannot be the zero polynomial in F_p[x].',
      roots: null,
      fText: null,
      p: null,
    };
  }

  const roots = [];
  for (let x = 0; x < p; x += 1) {
    if (polyEvalFp(f, x, p) === 0) {
      roots.push(x);
    }
  }

  return {
    error: null,
    roots,
    fText: fpPolyToString(f, p),
    p,
  };
}
