const EPS = 1e-10;

function trim(poly) {
  const out = [...poly];
  while (out.length > 0 && Math.abs(out[out.length - 1]) < EPS) {
    out.pop();
  }
  return out;
}

function isZero(poly) {
  return trim(poly).length === 0;
}

function degree(poly) {
  return trim(poly).length - 1;
}

function leading(poly) {
  const t = trim(poly);
  if (t.length === 0) {
    return 0;
  }
  return t[t.length - 1];
}

function polyToString(poly) {
  const p = trim(poly);
  if (p.length === 0) {
    return '0';
  }
  const parts = [];
  for (let e = p.length - 1; e >= 0; e -= 1) {
    const c = p[e];
    if (Math.abs(c) < EPS) {
      continue;
    }
    const sign = c < 0 ? '-' : '+';
    const absC = Math.abs(c);
    const cStr = Number.isInteger(absC) ? String(absC) : absC.toFixed(6).replace(/\.?0+$/, '');
    let term = '';
    if (e === 0) {
      term = cStr;
    } else if (e === 1) {
      term = absC === 1 ? 'x' : `${cStr}x`;
    } else {
      term = absC === 1 ? `x^${e}` : `${cStr}x^${e}`;
    }
    parts.push({ sign, term });
  }
  if (parts.length === 0) {
    return '0';
  }
  return parts
    .map((pTerm, i) =>
      i === 0
        ? (pTerm.sign === '-' ? '- ' : '') + pTerm.term
        : `${pTerm.sign} ${pTerm.term}`
    )
    .join(' ');
}

function parseTerm(term) {
  const match = term.match(/^([+-]?)(\d*(?:\.\d+)?)?(x)?(?:\^(\d+))?$/);
  if (!match) {
    return null;
  }
  const sign = match[1] === '-' ? -1 : 1;
  const coeffText = match[2];
  const hasX = Boolean(match[3]);
  const expText = match[4];

  let exponent = 0;
  let coeff = 0;
  if (hasX) {
    exponent = expText ? Number(expText) : 1;
    if (!Number.isInteger(exponent) || exponent < 0) {
      return null;
    }
    if (coeffText === '' || coeffText === undefined) {
      coeff = 1;
    } else {
      coeff = Number(coeffText);
    }
  } else {
    if (coeffText === '' || coeffText === undefined) {
      return null;
    }
    coeff = Number(coeffText);
    exponent = 0;
  }

  if (!Number.isFinite(coeff)) {
    return null;
  }

  return { exponent, coeff: sign * coeff };
}

export function parsePolynomial(input) {
  const raw = String(input ?? '').replace(/\s+/g, '');
  if (!raw) {
    return { error: 'Polynomial cannot be empty.', poly: null };
  }

  const normalized = raw[0] === '-' ? raw : `+${raw}`;
  const terms = normalized.match(/[+-][^+-]+/g);
  if (!terms) {
    return { error: 'Invalid polynomial format.', poly: null };
  }

  const coeffs = [];
  for (const t of terms) {
    const parsed = parseTerm(t);
    if (!parsed) {
      return { error: `Invalid term "${t}".`, poly: null };
    }
    while (coeffs.length <= parsed.exponent) {
      coeffs.push(0);
    }
    coeffs[parsed.exponent] += parsed.coeff;
  }
  return { error: null, poly: trim(coeffs) };
}

function subtract(a, b) {
  const len = Math.max(a.length, b.length);
  const out = Array(len).fill(0);
  for (let i = 0; i < len; i += 1) {
    out[i] = (a[i] || 0) - (b[i] || 0);
  }
  return trim(out);
}

function polyMul(a, b) {
  if (isZero(a) || isZero(b)) {
    return [];
  }
  const out = Array(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < b.length; j += 1) {
      out[i + j] += a[i] * b[j];
    }
  }
  return trim(out);
}

function scalePoly(p, s) {
  if (Math.abs(s) < EPS) {
    return [];
  }
  return trim(p.map((c) => c * s));
}

function multiplyMonomial(poly, coeff, exp) {
  const out = Array(poly.length + exp).fill(0);
  for (let i = 0; i < poly.length; i += 1) {
    out[i + exp] = poly[i] * coeff;
  }
  return trim(out);
}

function divide(dividend, divisor) {
  const a = trim(dividend);
  const b = trim(divisor);
  if (isZero(b)) {
    throw new Error('division by zero polynomial');
  }
  let rem = [...a];
  let q = [];
  while (!isZero(rem) && degree(rem) >= degree(b)) {
    const exp = degree(rem) - degree(b);
    const coeff = leading(rem) / leading(b);
    while (q.length <= exp) {
      q.push(0);
    }
    q[exp] += coeff;
    rem = subtract(rem, multiplyMonomial(b, coeff, exp));
  }
  return { q: trim(q), r: trim(rem) };
}

function toMonic(poly) {
  const p = trim(poly);
  if (p.length === 0) {
    return p;
  }
  const lead = leading(p);
  return trim(p.map((c) => c / lead));
}

function add(a, b) {
  const len = Math.max(a.length, b.length);
  const out = Array(len).fill(0);
  for (let i = 0; i < len; i += 1) {
    out[i] = (a[i] || 0) + (b[i] || 0);
  }
  return trim(out);
}

function bezoutResidual(u, v, f, g) {
  return add(polyMul(u, f), polyMul(v, g));
}

function nearlyEqualPoly(a, b) {
  const t1 = trim(a);
  const t2 = trim(b);
  if (t1.length !== t2.length) {
    return false;
  }
  for (let i = 0; i < t1.length; i += 1) {
    if (Math.abs(t1[i] - t2[i]) > 1e-6 * Math.max(1, Math.abs(t1[i]), Math.abs(t2[i]))) {
      return false;
    }
  }
  return true;
}

/**
 * Extended gcd over ℝ[x]: d monic, u·f + v·g = d.
 */
export function polynomialExtendedGcd(fInput, gInput) {
  const fParsed = parsePolynomial(fInput);
  if (fParsed.error) {
    return {
      error: `f(x): ${fParsed.error}`,
      steps: [],
      d: null,
      u: null,
      v: null,
    };
  }
  const gParsed = parsePolynomial(gInput);
  if (gParsed.error) {
    return {
      error: `g(x): ${gParsed.error}`,
      steps: [],
      d: null,
      u: null,
      v: null,
    };
  }

  const f = fParsed.poly;
  const g = gParsed.poly;

  if (isZero(f) && isZero(g)) {
    return {
      error: 'At least one polynomial must be non-zero.',
      steps: [],
      d: null,
      u: null,
      v: null,
    };
  }

  const steps = [];

  if (isZero(f)) {
    const lc = leading(g);
    const d = toMonic(g);
    const u = [];
    const v = scalePoly([1], 1 / lc);
    steps.push('f(x) = 0: gcd(0, g) = monic(g).');
    steps.push(
      lc === 1
        ? `u(x) = 0, v(x) = 1.`
        : `u(x) = 0, v(x) = 1/${lc} = ${polyToString(v)}.`
    );
    steps.push(`d(x) = ${polyToString(d)}.`);
    return finishResult(steps, f, g, u, v, d);
  }

  if (isZero(g)) {
    const lc = leading(f);
    const d = toMonic(f);
    const u = scalePoly([1], 1 / lc);
    const v = [];
    steps.push('g(x) = 0: gcd(f, 0) = monic(f).');
    steps.push(
      lc === 1
        ? `u(x) = 1, v(x) = 0.`
        : `u(x) = 1/${lc} = ${polyToString(u)}, v(x) = 0.`
    );
    steps.push(`d(x) = ${polyToString(d)}.`);
    return finishResult(steps, f, g, u, v, d);
  }

  let r0 = f;
  let r1 = g;
  let u0 = [1];
  let v0 = [0];
  let u1 = [0];
  let v1 = [1];

  steps.push('Extended Euclidean algorithm in ℝ[x].');
  steps.push(`Initialize: r₀ = f = ${polyToString(r0)}, r₁ = g = ${polyToString(r1)}.`);
  steps.push('(u₀,v₀) = (1,0), (u₁,v₁) = (0,1) so uᵢf + vᵢg = rᵢ.');

  let k = 1;
  while (!isZero(r1)) {
    const { q, r } = divide(r0, r1);
    const u2 = subtract(u0, polyMul(q, u1));
    const v2 = subtract(v0, polyMul(q, v1));
    steps.push(
      `Step ${k}: divide r₀ by r₁ → q(x) = ${polyToString(q)}, r(x) = ${polyToString(r)}.`
    );
    steps.push(
      `         u₂ = u₀ − q·u₁ = ${polyToString(u2)}, v₂ = v₀ − q·v₁ = ${polyToString(v2)}.`
    );
    r0 = r1;
    r1 = r;
    u0 = u1;
    u1 = u2;
    v0 = v1;
    v1 = v2;
    k += 1;
  }

  const rawGcd = r0;
  const lc = leading(rawGcd);
  const d = toMonic(rawGcd);
  let u = scalePoly(u0, 1 / lc);
  let v = scalePoly(v0, 1 / lc);

  steps.push('Remainder 0: last non-zero remainder is gcd (before scaling to monic).');
  steps.push(
    `Scale by 1/lc = ${1 / lc}: d(x) = ${polyToString(d)}, u(x) = ${polyToString(u)}, v(x) = ${polyToString(v)}.`
  );

  const check = bezoutResidual(u, v, f, g);
  if (!nearlyEqualPoly(check, d)) {
    return {
      error: 'Internal check failed: u·f + v·g ≠ d.',
      steps,
      d: null,
      u: null,
      v: null,
    };
  }
  steps.push(`Check: u(x)·f(x) + v(x)·g(x) = ${polyToString(check)} = d(x).`);

  return finishResult(steps, f, g, u, v, d);
}

function finishResult(steps, f, g, u, v, d) {
  return {
    error: null,
    steps,
    d,
    u,
    v,
    dText: polyToString(d),
    uText: polyToString(u),
    vText: polyToString(v),
    fText: polyToString(f),
    gText: polyToString(g),
  };
}

/** @deprecated Use polynomialExtendedGcd; kept for tests expecting the same name. */
export function polynomialGcd(fInput, gInput) {
  return polynomialExtendedGcd(fInput, gInput);
}
