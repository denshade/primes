/* global BigInt */

import { jacobiSymbol } from './jacobiSymbol';

function modPow(base, exp, mod) {
  let b = ((base % mod) + mod) % mod;
  let e = exp;
  let r = 1n;
  while (e > 0n) {
    if (e & 1n) {
      r = (r * b) % mod;
    }
    b = (b * b) % mod;
    e >>= 1n;
  }
  return r;
}

/**
 * Deterministic Miller–Rabin for all 64-bit odd integers (Jaeschke witnesses).
 */
function isPrimeBigInt(n) {
  if (n < 2n) {
    return false;
  }
  if (n === 2n) {
    return true;
  }
  if (n % 2n === 0n) {
    return false;
  }

  const small = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n];
  for (const d of small) {
    if (n === d) {
      return true;
    }
    if (n % d === 0n) {
      return false;
    }
  }

  let d = n - 1n;
  let s = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    s += 1;
  }

  const witnesses = [
    2n,
    325n,
    9375n,
    28178n,
    450775n,
    9780504n,
    1795265022n,
  ];

  for (const a0 of witnesses) {
    const a = a0 % n;
    if (a === 0n) {
      continue;
    }
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) {
      continue;
    }
    let composite = true;
    for (let r = 1; r < s; r += 1) {
      x = (x * x) % n;
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) {
      return false;
    }
  }
  return true;
}

/**
 * One square root of a modulo odd prime p when (a/p) = 1; Tonelli–Shanks.
 * Returns r with r^2 ≡ a (mod p), 0 ≤ r < p.
 */
function oneSqrtModPrime(a, p) {
  const n = ((a % p) + p) % p;
  if (n === 0n) {
    return 0n;
  }
  if (p === 2n) {
    return n;
  }
  if (p % 4n === 3n) {
    return modPow(n, (p + 1n) / 4n, p);
  }

  let q = p - 1n;
  let s = 0;
  while (q % 2n === 0n) {
    q /= 2n;
    s += 1;
  }

  let z = 2n;
  while (jacobiSymbol(z, p).value !== -1) {
    z += 1n;
  }

  let m = s;
  let c = modPow(z, q, p);
  let t = modPow(n, q, p);
  let r = modPow(n, (q + 1n) / 2n, p);

  while (t !== 1n) {
    let i = 1;
    let t2i = (t * t) % p;
    while (t2i !== 1n) {
      t2i = (t2i * t2i) % p;
      i += 1;
    }
    const exp = 1n << BigInt(m - i - 1);
    const b = modPow(c, exp, p);
    r = (r * b) % p;
    c = (b * b) % p;
    t = (t * c) % p;
    m = i;
  }

  return r;
}

/**
 * Square roots of a modulo odd prime p when (a/p) = 1.
 * @returns {{ error: string, roots: null } | { error: null, roots: [bigint, bigint] }}
 */
export function sqrtModPrime(aInput, pInput) {
  let p;
  let a;
  try {
    p = BigInt(pInput);
    a = BigInt(aInput);
  } catch {
    return { error: 'a and p must be integers.', roots: null };
  }

  if (p < 3n) {
    return { error: 'p must be an odd prime ≥ 3.', roots: null };
  }
  if (p % 2n === 0n) {
    return { error: 'p must be odd.', roots: null };
  }
  const maxP = 1n << 64n;
  if (p >= maxP) {
    return {
      error: 'p must be smaller than 2^64 (automatic primality check limit).',
      roots: null,
    };
  }
  if (!isPrimeBigInt(p)) {
    return { error: 'p must be prime.', roots: null };
  }

  const am = ((a % p) + p) % p;
  const leg = jacobiSymbol(am, p);
  if (leg.error) {
    return { error: leg.error, roots: null };
  }
  if (leg.value !== 1) {
    return {
      error:
        'The Jacobi symbol (a/p) must be +1 (quadratic residue modulo p).',
      roots: null,
    };
  }

  const r = oneSqrtModPrime(am, p);
  const r2 = (p - r) % p;
  if (r <= r2) {
    return { error: null, roots: [r, r2] };
  }
  return { error: null, roots: [r2, r] };
}
