/* global BigInt */

import { parsePolynomial } from './polynomialGcd';
import {
  degreeFp,
  fpPolyToString,
  isZeroFp,
  modP,
  polyGcdFp,
  polyPowModFp,
  polySubFp,
  trimFp,
} from './fpPolynomial';

const X = [0, 1];

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

function modInvInt(a, p) {
  let x = modP(a, p);
  if (x === 0) {
    return null;
  }
  let [oldR, r] = [x, p];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  if (oldR !== 1) {
    return null;
  }
  return modP(oldS, p);
}

function monicPoly(g, p) {
  const t = trimFp(g, p);
  if (t.length === 0) {
    return t;
  }
  const inv = modInvInt(t[t.length - 1], p);
  if (inv === null) {
    return t;
  }
  return t.map((c) => modP(c * inv, p));
}

/**
 * Iterative irreducibility test over F_p[x]:
 * g = x;
 * for i = 1..floor(k/2):
 *   g = g^p mod f;
 *   d = gcd(f, g - x);
 *   if d != 1 return reducible;
 * return irreducible.
 */
export function irreducibilityTestFp(pInput, fInput) {
  const steps = [];
  const p = parseInt(String(pInput).trim(), 10);
  if (!Number.isFinite(p) || p < 2) {
    return { error: 'p must be an integer ≥ 2.', irreducible: null, steps: [] };
  }
  if (!isPrime(p)) {
    return { error: 'p must be prime.', irreducible: null, steps: [] };
  }

  const parsed = parsePolynomial(fInput);
  if (parsed.error) {
    return { error: parsed.error, irreducible: null, steps: [] };
  }

  const f = trimFp(
    parsed.poly.map((c) => modP(Math.round(Number(c)), p)),
    p
  );

  if (isZeroFp(f, p)) {
    return { error: 'f(x) cannot be 0 in F_p[x].', irreducible: null, steps: [] };
  }

  const n = degreeFp(f, p);
  if (n < 2) {
    return {
      error: 'Degree of f must be at least 2.',
      irreducible: null,
      steps: [],
    };
  }

  steps.push(`Field: F_${p}, f(x) = ${fpPolyToString(f, p)} (deg f = ${n}).`);
  steps.push(
    `Algorithm: g(x)=x. For i=1..floor(${n}/2), set g <- g^${p} mod f, d <- gcd(f, g-x). If d != 1 then reducible; else continue.`
  );

  let g = [...X];
  const half = Math.floor(n / 2);
  for (let i = 1; i <= half; i += 1) {
    g = polyPowModFp(g, BigInt(p), f, p);
    const dRaw = polyGcdFp(f, polySubFp(g, X, p), p);
    const d = monicPoly(dRaw, p);
    const isOne = d.length === 1 && d[0] === 1;
    steps.push(
      `i=${i}: g(x)=${fpPolyToString(g, p)}; d(x)=gcd(f, g-x)=${fpPolyToString(d, p)}.`
    );
    if (!isOne) {
      steps.push('Found d(x) != 1, so f is reducible over F_p.');
      return {
        error: null,
        irreducible: false,
        steps,
        fText: fpPolyToString(f, p),
        p,
        degree: n,
      };
    }
  }

  steps.push('All iterations passed with d(x)=1. Conclusion: f is irreducible over F_p.');

  return {
    error: null,
    irreducible: true,
    steps,
    fText: fpPolyToString(f, p),
    p,
    degree: n,
  };
}
