import { useState } from 'react';
import { sqrtModPrime } from '../utils/sqrtModPrime';
import './EuclidExtendedPage.css';
import './SqrtModPPage.css';

function SqrtModPPage() {
  const [aInput, setAInput] = useState('');
  const [pInput, setPInput] = useState('');
  const [error, setError] = useState('');
  const [roots, setRoots] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setRoots(null);

    const out = sqrtModPrime(aInput, pInput);
    if (out.error) {
      setError(out.error);
      return;
    }
    setRoots(out.roots);
  }

  return (
    <div className="page euclid-page sqrt-mod-p-page">
      <section className="sqrt-mod-p-explain" aria-labelledby="sqrt-mod-p-heading">
        <h1 id="sqrt-mod-p-heading" className="sqrt-mod-p-title">
          Square roots modulo an odd prime
        </h1>
        <p>
          Let <em>p</em> be an <strong>odd prime</strong> and <em>a</em> an
          integer with Legendre symbol{' '}
          <span className="sqrt-mod-p-inline">
            (<em>a</em> / <em>p</em>) = +1
          </span>
          . Then there are two solutions <em>x</em> to{' '}
          <span className="sqrt-mod-p-inline">
            <em>x</em>² ≡ <em>a</em> (mod <em>p</em>)
          </span>
          , namely some <em>r</em> and <em>p</em> − <em>r</em>. This tool
          finds them using the Tonelli–Shanks algorithm (and the closed form when{' '}
          <em>p</em> ≡ 3 (mod 4)).
        </p>
        <p>
          Primality of <em>p</em> is checked automatically for{' '}
          <em>p</em> &lt; 2<sup>64</sup>. You must have{' '}
          <strong>(<em>a</em> / <em>p</em>) = +1</strong> (quadratic residue); if
          the symbol is −1 or 0, no such square root exists (other than{' '}
          <em>a</em> ≡ 0, which has symbol 0).
        </p>
      </section>

      <form className="euclid-form sqrt-mod-p-form" onSubmit={handleSubmit}>
        <div className="euclid-field">
          <label htmlFor="sqrt-mod-p-a">a</label>
          <input
            id="sqrt-mod-p-a"
            type="text"
            inputMode="numeric"
            value={aInput}
            onChange={(ev) => setAInput(ev.target.value)}
            aria-label="a"
          />
        </div>
        <div className="euclid-field">
          <label htmlFor="sqrt-mod-p-p">p (odd prime, &lt; 2⁶⁴)</label>
          <input
            id="sqrt-mod-p-p"
            type="text"
            inputMode="numeric"
            value={pInput}
            onChange={(ev) => setPInput(ev.target.value)}
            aria-label="p odd prime"
          />
        </div>
        <button type="submit" className="euclid-submit">
          Calculate
        </button>
      </form>

      {error ? (
        <p className="euclid-error" role="alert">
          {error}
        </p>
      ) : null}

      {roots ? (
        <aside
          className="euclid-answer sqrt-mod-p-result"
          data-testid="sqrt-mod-p-answer"
          aria-label="Square roots modulo p"
        >
          <p className="euclid-answer-title">Solutions</p>
          <p className="euclid-answer-body sqrt-mod-p-result-body">
            <em>x</em> ≡ <strong>{String(roots[0])}</strong> or{' '}
            <strong>{String(roots[1])}</strong> (mod <em>p</em>)
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default SqrtModPPage;
