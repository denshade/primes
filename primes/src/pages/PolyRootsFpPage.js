import { useState } from 'react';
import { rootsPolynomialFp } from '../utils/polyRootsFp';
import './EuclidExtendedPage.css';
import './FpIrreduciblePage.css';

function PolyRootsFpPage() {
  const [pInput, setPInput] = useState('');
  const [fInput, setFInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setResult(null);

    const out = rootsPolynomialFp(pInput, fInput);
    if (out.error) {
      setError(out.error);
      return;
    }
    setResult({
      roots: out.roots,
      fText: out.fText,
      p: out.p,
    });
  }

  return (
    <div className="page euclid-page">
      <p className="fp-irr-intro">
        Roots of a polynomial in <strong>F</strong>
        <sub>p</sub>: coefficients are reduced modulo the prime <em>p</em>, then
        each field element is tested in turn (so <em>p</em> is capped for
        performance).
      </p>

      <form className="fp-irr-form" onSubmit={handleSubmit}>
        <div className="euclid-field">
          <label htmlFor="poly-roots-p">p (prime)</label>
          <input
            id="poly-roots-p"
            type="number"
            min={2}
            step={1}
            value={pInput}
            onChange={(ev) => setPInput(ev.target.value)}
            aria-label="p prime"
          />
        </div>
        <div className="fp-irr-field">
          <label htmlFor="poly-roots-f">f(x)</label>
          <input
            id="poly-roots-f"
            type="text"
            className="fp-irr-f-input"
            value={fInput}
            onChange={(ev) => setFInput(ev.target.value)}
            placeholder="e.g. x^2 - 1"
            aria-label="f(x) polynomial"
          />
        </div>
        <p className="fp-irr-hint">
          Same term syntax as the other polynomial tools. Coefficients are taken mod{' '}
          <em>p</em>.
        </p>
        <button type="submit" className="euclid-submit">
          Find roots in F_p
        </button>
      </form>

      {error ? (
        <p className="euclid-error" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <aside
          className="euclid-answer"
          data-testid="poly-roots-fp-answer"
          aria-label="Roots in F_p"
        >
          <p className="euclid-answer-title">Roots</p>
          <p className="euclid-answer-body">
            Over F<sub>{result.p}</sub>, f(x) = {result.fText}.{' '}
            {result.roots.length === 0 ? (
              <>
                There are <strong>no</strong> roots in F<sub>{result.p}</sub>.
              </>
            ) : (
              <>
                The roots are{' '}
                <strong data-testid="poly-roots-fp-list">
                  {result.roots.join(', ')}
                </strong>
                .
              </>
            )}
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default PolyRootsFpPage;
