/** @param {number} a @param {number} p */
export function modP(a, p) {
  let x = a % p;
  if (x < 0) {
    x += p;
  }
  return x;
}

/** Coefficient array: coeffs[i] is coefficient of x^i. */
export function trimFp(poly, p) {
  const out = poly.map((c) => modP(c, p));
  while (out.length > 0 && out[out.length - 1] === 0) {
    out.pop();
  }
  return out;
}

export function isZeroFp(poly, p) {
  return trimFp(poly, p).length === 0;
}

export function degreeFp(poly, p) {
  return trimFp(poly, p).length - 1;
}

/** Evaluate poly (coeffs ascending: c₀ + c₁x + …) at x in F_p (Horner). */
export function polyEvalFp(poly, x, p) {
  const t = trimFp(poly, p);
  if (t.length === 0) {
    return 0;
  }
  const xi = modP(x, p);
  let r = t[t.length - 1];
  for (let i = t.length - 2; i >= 0; i -= 1) {
    r = modP(r * xi + t[i], p);
  }
  return r;
}

export function leadingFp(poly, p) {
  const t = trimFp(poly, p);
  if (t.length === 0) {
    return 0;
  }
  return t[t.length - 1];
}

function modInv(a, p) {
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

export function polyAddFp(a, b, p) {
  const len = Math.max(a.length, b.length);
  const out = [];
  for (let i = 0; i < len; i += 1) {
    out.push(modP((a[i] || 0) + (b[i] || 0), p));
  }
  return trimFp(out, p);
}

export function polySubFp(a, b, p) {
  const len = Math.max(a.length, b.length);
  const out = [];
  for (let i = 0; i < len; i += 1) {
    out.push(modP((a[i] || 0) - (b[i] || 0), p));
  }
  return trimFp(out, p);
}

export function polyMulFp(a, b, p) {
  if (isZeroFp(a, p) || isZeroFp(b, p)) {
    return [];
  }
  const out = Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      out[i + j] = modP(out[i + j] + modP(a[i] * b[j], p), p);
    }
  }
  return trimFp(out, p);
}

function multiplyMonomialFp(poly, coeff, exp, p) {
  if (coeff === 0 || isZeroFp(poly, p)) {
    return [];
  }
  const c = modP(coeff, p);
  const out = Array(poly.length + exp).fill(0);
  for (let i = 0; i < poly.length; i += 1) {
    out[i + exp] = modP(poly[i] * c, p);
  }
  return trimFp(out, p);
}

/** Polynomial long division in F_p[x]: returns { q, r } with a = q*b + r. */
export function polyDivModFp(dividend, divisor, p) {
  const a = trimFp(dividend, p);
  const b = trimFp(divisor, p);
  if (isZeroFp(b, p)) {
    throw new Error('division by zero polynomial');
  }
  let rem = [...a];
  let q = [];
  const db = degreeFp(b, p);
  const lb = leadingFp(b, p);
  const invB = modInv(lb, p);
  if (invB === null) {
    throw new Error('non-invertible leading coefficient');
  }
  while (!isZeroFp(rem, p) && degreeFp(rem, p) >= db) {
    const dr = degreeFp(rem, p);
    const exp = dr - db;
    const coeff = modP(leadingFp(rem, p) * invB, p);
    while (q.length <= exp) {
      q.push(0);
    }
    q[exp] = modP(q[exp] + coeff, p);
    rem = polySubFp(rem, multiplyMonomialFp(b, coeff, exp, p), p);
  }
  return { q: trimFp(q, p), r: trimFp(rem, p) };
}

export function polyRemFp(a, b, p) {
  return polyDivModFp(a, b, p).r;
}

export function polyGcdFp(a, b, p) {
  let u = trimFp(a, p);
  let v = trimFp(b, p);
  while (!isZeroFp(v, p)) {
    const r = polyRemFp(u, v, p);
    u = v;
    v = r;
  }
  return u;
}

/** base^exp mod modPoly in F_p[x], exp nonnegative BigInt. */
export function polyPowModFp(base, exp, modPoly, p) {
  const f = trimFp(modPoly, p);
  if (isZeroFp(f, p)) {
    throw new Error('modulus polynomial is zero');
  }
  let result = [1];
  let b = trimFp(base, p);
  let e = exp;
  while (e > 0n) {
    if (e & 1n) {
      result = polyRemFp(polyMulFp(result, b, p), f, p);
    }
    b = polyRemFp(polyMulFp(b, b, p), f, p);
    e >>= 1n;
  }
  return trimFp(result, p);
}

export function polyEqualFp(a, b, p) {
  const t1 = trimFp(a, p);
  const t2 = trimFp(b, p);
  if (t1.length !== t2.length) {
    return false;
  }
  for (let i = 0; i < t1.length; i += 1) {
    if (t1[i] !== t2[i]) {
      return false;
    }
  }
  return true;
}

/** Human-readable polynomial over F_p (coefficients in {0,…,p−1}). */
export function fpPolyToString(poly, p) {
  const t = trimFp(poly, p);
  if (t.length === 0) {
    return '0';
  }
  const parts = [];
  for (let e = t.length - 1; e >= 0; e -= 1) {
    const c = t[e];
    if (c === 0) {
      continue;
    }
    const cStr = String(c);
    let term = '';
    if (e === 0) {
      term = cStr;
    } else if (e === 1) {
      term = c === 1 ? 'x' : `${cStr}x`;
    } else {
      term = c === 1 ? `x^${e}` : `${cStr}x^${e}`;
    }
    parts.push(term);
  }
  if (parts.length === 0) {
    return '0';
  }
  return parts.join(' + ').replace(/\+ -/g, '- ');
}
