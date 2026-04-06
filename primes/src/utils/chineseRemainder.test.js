import { chineseRemainder } from './chineseRemainder';

describe('chineseRemainder', () => {
  it('solves a standard three-modulus system', () => {
    const r = chineseRemainder(['3', '5', '7'], ['2', '3', '2']);
    expect(r.error).toBeNull();
    expect(r.n).toBe(23n);
    expect(r.M).toBe(105n);
  });

  it('handles a single congruence', () => {
    const r = chineseRemainder(['11'], ['4']);
    expect(r.error).toBeNull();
    expect(r.n).toBe(4n);
    expect(r.M).toBe(11n);
  });

  it('rejects non-coprime moduli', () => {
    const r = chineseRemainder(['4', '6'], ['1', '1']);
    expect(r.error).toMatch(/pairwise coprime/i);
  });

  it('rejects mismatched lengths', () => {
    const r = chineseRemainder(['3'], ['1', '2']);
    expect(r.error).toBeTruthy();
  });

  it('normalizes residues modulo m', () => {
    const r = chineseRemainder(['5'], ['12']);
    expect(r.error).toBeNull();
    expect(r.n).toBe(2n);
  });
});
