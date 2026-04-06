/* global BigInt */

/**
 * Extended gcd for nonnegative BigInts; returns [g, x, y] with ax + by = g.
 */
function extendedGcdBig(a, b) {
  if (b === 0n) {
    return [a, 1n, 0n];
  }
  const [g, x1, y1] = extendedGcdBig(b, a % b);
  const x = y1;
  const y = x1 - (a / b) * y1;
  return [g, x, y];
}

function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function modInverseBig(a, m) {
  const aPos = ((a % m) + m) % m;
  const [g, x] = extendedGcdBig(aPos, m);
  if (g !== 1n) {
    return null;
  }
  return (x % m + m) % m;
}

/**
 * Chinese Remainder Theorem: find n with n ≡ residues[i] (mod moduli[i]).
 * Moduli must be positive and pairwise coprime.
 * @param {string[]} moduliStr
 * @param {string[]} residuesStr
 */
export function chineseRemainder(moduliStr, residuesStr) {
  const steps = [];

  if (!Array.isArray(moduliStr) || !Array.isArray(residuesStr)) {
    return {
      error: 'Invalid input.',
      steps: [],
      n: null,
      M: null,
    };
  }

  if (moduliStr.length !== residuesStr.length) {
    return {
      error: 'Provide the same number of moduli m and residues n.',
      steps: [],
      n: null,
      M: null,
    };
  }

  const r = moduliStr.length;
  if (r === 0) {
    return {
      error: 'Add at least one congruence (m, n).',
      steps: [],
      n: null,
      M: null,
    };
  }

  const moduli = [];
  const residues = [];

  for (let i = 0; i < r; i += 1) {
    const ms = moduliStr[i].trim();
    const ns = residuesStr[i].trim();
    if (ms === '' || ns === '') {
      return {
        error: 'Each modulus m and residue n must be filled in.',
        steps: [],
        n: null,
        M: null,
      };
    }
    let mbi;
    let nbi;
    try {
      mbi = BigInt(ms);
      nbi = BigInt(ns);
    } catch {
      return {
        error: 'Moduli and residues must be integers.',
        steps: [],
        n: null,
        M: null,
      };
    }
    if (mbi <= 0n) {
      return {
        error: 'Each modulus m must be positive.',
        steps: [],
        n: null,
        M: null,
      };
    }
    moduli.push(mbi);
    residues.push(((nbi % mbi) + mbi) % mbi);
  }

  for (let i = 0; i < r; i += 1) {
    for (let j = i + 1; j < r; j += 1) {
      const g = gcdBig(moduli[i], moduli[j]);
      if (g !== 1n) {
        return {
          error: `Moduli must be pairwise coprime. gcd(m_${i + 1}, m_${j + 1}) = ${g}.`,
          steps: [],
          n: null,
          M: null,
        };
      }
    }
  }

  let M = 1n;
  for (const m of moduli) {
    M *= m;
  }

  steps.push(`M = m₁·m₂·…·m_r = ${M}.`);
  steps.push('Residues reduced modulo each mᵢ (shown as nᵢ).');

  let sum = 0n;
  for (let i = 0; i < r; i += 1) {
    const mi = moduli[i];
    const ni = residues[i];
    const Mi = M / mi;
    const inv = modInverseBig(Mi % mi, mi);
    if (inv === null) {
      return {
        error: 'Could not invert Mᵢ mod mᵢ (unexpected for coprime moduli).',
        steps: [],
        n: null,
        M: null,
      };
    }
    const term = (ni * Mi * inv) % M;
    steps.push(
      `i=${i + 1}: Mᵢ = M/mᵢ = ${Mi}; Mᵢ⁻¹ (mod mᵢ) = ${inv}; term = nᵢ·Mᵢ·(Mᵢ⁻¹) = ${ni}·${Mi}·${inv} ≡ ${term} (mod M).`
    );
    sum = (sum + term) % M;
  }

  const n = ((sum % M) + M) % M;
  steps.push(`Sum terms mod M → n = ${n}.`);
  steps.push(`Check: n mod each mᵢ matches the given residues.`);

  return {
    error: null,
    steps,
    n,
    M,
    moduli,
    residues,
  };
}
