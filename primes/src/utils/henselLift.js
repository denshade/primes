/* global BigInt */

import { parsePolynomial } from './polynomialGcd';

const MAX_P = 100_000;
const MAX_K = 100;
/** Reject p^k when log₁₀(p^k) exceeds this (keeps BigInt work and UI reasonable). */
const MAX_LOG10_MODULUS = 5000;

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

function modBig(a, m) {
  let x = a % m;
  if (x < 0n) {
    x += m;
  }
  return x;
}

/** Modular inverse of a mod prime p (0 < a < p). */
function modInvPrime(a, p) {
  const pB = BigInt(p);
  let x = modBig(a, pB);
  if (x === 0n) {
    return null;
  }
  let [oldR, r] = [x, pB];
  let [oldS, s] = [1n, 0n];
  while (r !== 0n) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  if (oldR !== 1n) {
    return null;
  }
  return modBig(oldS, pB);
}

function polyEvalBigInt(coeffs, x) {
  const n = coeffs.length - 1;
  let acc = coeffs[n];
  for (let i = n - 1; i >= 0; i -= 1) {
    acc = acc * x + coeffs[i];
  }
  return acc;
}

function polyDerivativeBigInt(coeffs) {
  if (coeffs.length <= 1) {
    return [];
  }
  const out = [];
  for (let i = 1; i < coeffs.length; i += 1) {
    out.push(BigInt(i) * coeffs[i]);
  }
  return out;
}

function trimBig(coeffs) {
  const out = [...coeffs];
  while (out.length > 1 && out[out.length - 1] === 0n) {
    out.pop();
  }
  return out;
}

/** Human-readable Z[x] polynomial with BigInt coefficients. */
export function integerPolyToString(coeffs) {
  const t = trimBig(coeffs);
  if (t.length === 0) {
    return '0';
  }
  const parts = [];
  for (let e = t.length - 1; e >= 0; e -= 1) {
    const c = t[e];
    if (c === 0n) {
      continue;
    }
    const abs = c >= 0n ? c : -c;
    const sign = c >= 0n ? '+' : '-';
    let term = '';
    if (e === 0) {
      term = String(abs);
    } else if (e === 1) {
      term = abs === 1n ? 'x' : `${String(abs)}x`;
    } else {
      term = abs === 1n ? `x^${e}` : `${String(abs)}x^${e}`;
    }
    if (parts.length === 0) {
      parts.push(c >= 0n ? term : `-${term}`);
    } else {
      parts.push(`${sign} ${term}`);
    }
  }
  return parts.join(' ').replace(/\+ -/g, '- ');
}

function coeffToBigInt(c) {
  const n = Number(c);
  if (!Number.isFinite(n)) {
    return { error: 'Non-numeric coefficient.', value: null };
  }
  const r = Math.round(n);
  if (Math.abs(r) > Number.MAX_SAFE_INTEGER) {
    return {
      error: 'Coefficient too large (use integers within safe range).',
      value: null,
    };
  }
  return { error: null, value: BigInt(r) };
}

/**
 * Hensel lift: given f ∈ Z[x], prime p, simple root r₀ mod p (f(r₀)≡0, f'(r₀)≢0 mod p),
 * compute the unique lift r mod p^k with r ≡ r₀ (mod p).
 */
export function henselLiftPolynomial(pInput, fInput, r0Input, kInput) {
  const steps = [];

  const p = parseInt(String(pInput).trim(), 10);
  if (!Number.isFinite(p) || p < 2 || p > MAX_P) {
    return {
      error: `p must be an integer with 2 ≤ p ≤ ${MAX_P}.`,
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }
  if (!isPrime(p)) {
    return {
      error: 'p must be prime.',
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  const k = parseInt(String(kInput).trim(), 10);
  if (!Number.isFinite(k) || k < 1 || k > MAX_K) {
    return {
      error: `k must be an integer with 1 ≤ k ≤ ${MAX_K}.`,
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  if (k * Math.log10(p) > MAX_LOG10_MODULUS) {
    return {
      error: 'p^k is too large for this tool (reduce p or k).',
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  const parsed = parsePolynomial(fInput);
  if (parsed.error) {
    return {
      error: parsed.error,
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  const fCoeffs = [];
  for (const c of parsed.poly) {
    const conv = coeffToBigInt(c);
    if (conv.error) {
      return {
        error: conv.error,
        steps: [],
        r: null,
        p: null,
        k: null,
        modulus: null,
        fText: null,
      };
    }
    fCoeffs.push(conv.value);
  }
  if (trimBig(fCoeffs).length === 0) {
    return {
      error: 'f(x) cannot be the zero polynomial.',
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  const fText = integerPolyToString(fCoeffs);

  const r0Num = parseInt(String(r0Input).trim(), 10);
  if (!Number.isFinite(r0Num)) {
    return {
      error: 'r₀ must be an integer.',
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  const pB = BigInt(p);
  let r = modBig(BigInt(r0Num), pB);
  const fAtR0 = polyEvalBigInt(fCoeffs, r);
  if (fAtR0 % pB !== 0n) {
    return {
      error: 'r₀ must satisfy f(r₀) ≡ 0 (mod p).',
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  const fpCoeffs = polyDerivativeBigInt(fCoeffs);
  const fpAtR0 = fpCoeffs.length === 0 ? 0n : polyEvalBigInt(fpCoeffs, r) % pB;
  if (fpAtR0 === 0n) {
    return {
      error:
        "Hensel's lemma (simple root) requires f'(r₀) ≢ 0 (mod p).",
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  const inv = modInvPrime(fpAtR0, p);
  if (inv === null) {
    return {
      error: "Could not invert f'(r₀) modulo p.",
      steps: [],
      r: null,
      p: null,
      k: null,
      modulus: null,
      fText: null,
    };
  }

  steps.push(`f(x) = ${fText}`);
  steps.push(
    `p = ${p}, k = ${k}, starting residue r₀ = ${String(r)} (mod p).`
  );
  steps.push(
    `f(r₀) ≡ 0 (mod p), f'(r₀) ≡ ${String(fpAtR0)} (mod p), inverse mod p = ${String(inv)}.`
  );
  steps.push(
    'Newton step for m = 2,…,k: r ← r − f(r)·(f′(r₀)⁻¹ mod p) (mod p^m).'
  );

  if (k === 1) {
    steps.push(`Result: r ≡ ${String(r)} (mod p).`);
    return {
      error: null,
      steps,
      r: String(r),
      p,
      k: 1,
      modulus: String(pB),
      fText,
    };
  }

  let pPow = pB;
  for (let m = 2; m <= k; m += 1) {
    pPow *= pB;
    const fr = polyEvalBigInt(fCoeffs, r);
    r = modBig(r - fr * inv, pPow);
    steps.push(`After step to mod p^${m}: r ≡ ${String(r)} (mod ${String(pPow)}).`);
  }

  steps.push(`Unique lift mod p^${k}: r = ${String(r)}.`);

  return {
    error: null,
    steps,
    r: String(r),
    p,
    k,
    modulus: String(pPow),
    fText,
  };
}
