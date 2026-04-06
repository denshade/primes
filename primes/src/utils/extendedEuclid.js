/**
 * Extended Euclidean algorithm: integers x, y with a·x + b·y = gcd(a, b).
 * @param {number} a
 * @param {number} b
 * @returns {{ gcd: number, x: number, y: number, steps: string[], error: null } | { gcd: null, x: null, y: null, steps: string[], error: string }}
 */
export function extendedEuclid(a, b) {
  const a0 = Math.trunc(Number(a));
  const b0 = Math.trunc(Number(b));

  if (!Number.isFinite(a0) || !Number.isFinite(b0)) {
    return {
      error: 'Enter valid integers for a and b.',
      steps: [],
      gcd: null,
      x: null,
      y: null,
    };
  }

  if (a0 === 0 && b0 === 0) {
    return {
      error: 'gcd(0, 0) is undefined.',
      steps: [],
      gcd: null,
      x: null,
      y: null,
    };
  }

  if (a0 === 0) {
    const g = Math.abs(b0);
    const y = b0 > 0 ? 1 : -1;
    const steps = [
      `a = 0, so gcd(0, ${b0}) = ${g}.`,
      `Bézout: 0·x + (${b0})·y = ${g}  →  x = 0, y = ${y}.`,
    ];
    return { gcd: g, x: 0, y, steps, error: null };
  }

  if (b0 === 0) {
    const g = Math.abs(a0);
    const x = a0 > 0 ? 1 : -1;
    const steps = [
      `b = 0, so gcd(${a0}, 0) = ${g}.`,
      `Bézout: (${a0})·x + 0·y = ${g}  →  x = ${x}, y = 0.`,
    ];
    return { gcd: g, x, y: 0, steps, error: null };
  }

  const signA = a0 < 0 ? -1 : 1;
  const signB = b0 < 0 ? -1 : 1;
  let r0 = Math.abs(a0);
  let r1 = Math.abs(b0);
  let s0 = 1;
  let s1 = 0;
  let t0 = 0;
  let t1 = 1;

  const steps = [];
  steps.push(
    `Using |a| = ${r0} and |b| = ${r1} (signs applied at the end).`
  );
  steps.push(
    `Initialize: r₀ = ${r0}, r₁ = ${r1}; (s₀,t₀) = (1,0), (s₁,t₁) = (0,1).`
  );

  let stepNum = 1;
  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    const r2 = r0 - q * r1;
    const s2 = s0 - q * s1;
    const t2 = t0 - q * t1;
    steps.push(
      `Step ${stepNum}: q = ⌊r₀/r₁⌋ = ⌊${r0}/${r1}⌋ = ${q};  r₂ = ${r0} − ${q}·${r1} = ${r2};  s₂ = ${s0} − ${q}·${s1} = ${s2};  t₂ = ${t0} − ${q}·${t1} = ${t2}.`
    );
    steps.push(
      `         (r₀,r₁,s₀,s₁,t₀,t₁) ← (${r1}, ${r2}, ${s1}, ${s2}, ${t1}, ${t2}).`
    );
    r0 = r1;
    r1 = r2;
    s0 = s1;
    s1 = s2;
    t0 = t1;
    t1 = t2;
    stepNum += 1;
  }

  const gcd = r0;
  const xp = s0;
  const yp = t0;
  const x = xp * signA;
  const y = yp * signB;

  steps.push(`Remainder is 0: gcd = ${gcd}.`);
  steps.push(
    `For |a|, |b|: x' = ${xp}, y' = ${yp}  →  ${Math.abs(a0)}·(${xp}) + ${Math.abs(b0)}·(${yp}) = ${gcd}.`
  );
  steps.push(`For a = ${a0}, b = ${b0}: x = ${x}, y = ${y}.`);
  steps.push(`Check: (${a0})·(${x}) + (${b0})·(${y}) = ${a0 * x + b0 * y}.`);

  return { gcd, x, y, steps, error: null };
}
