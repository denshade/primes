import { useState } from 'react';
import { jacobiSymbol } from '../utils/jacobiSymbol';
import './EuclidExtendedPage.css';
import './JacobiSymbolPage.css';

function formatSymbol(value) {
  if (value === 1) {
    return '+1';
  }
  if (value === -1) {
    return '−1';
  }
  if (value === 0) {
    return '0';
  }
  return String(value);
}

function JacobiSymbolPage() {
  const [aInput, setAInput] = useState('');
  const [pInput, setPInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const out = jacobiSymbol(aInput, pInput);
    if (out.error) {
      setError(out.error);
      return;
    }
    setResult(out.value);
  }

  return (
    <div className="page euclid-page jacobi-page">
      <section className="jacobi-explain" aria-labelledby="jacobi-heading">
        <h1 id="jacobi-heading" className="jacobi-title">
          Jacobi and Legendre symbols
        </h1>
        <p>
          For an odd prime <em>p</em>, the <strong>Legendre symbol</strong>{' '}
          <span className="jacobi-inline">
            (<em>a</em> / <em>p</em>)
          </span>{' '}
          records whether <em>a</em> is a quadratic residue modulo <em>p</em>:
          it is <strong>+1</strong> if <em>a</em> ≡ <em>x</em>² (mod <em>p</em>)
          for some <em>x</em> with gcd(<em>a</em>, <em>p</em>) = 1,{' '}
          <strong>−1</strong> if there is no such square, and <strong>0</strong>{' '}
          if <em>p</em> divides <em>a</em>.
        </p>
        <p>
          The <strong>Jacobi symbol</strong>{' '}
          <span className="jacobi-inline">
            (<em>a</em> / <em>n</em>)
          </span>{' '}
          extends this idea to any <strong>odd positive</strong> denominator{' '}
          <em>n</em>: factor <em>n</em> into primes and multiply the Legendre
          symbols (with the same numerator <em>a</em> modulo each prime). It
          still takes values in {'{−1, 0, +1}'}, but <strong>+1</strong> no
          longer guarantees that <em>a</em> is a square modulo <em>n</em> when{' '}
          <em>n</em> is composite.
        </p>
        <p>
          Below, <em>p</em> denotes that odd denominator (prime for Legendre,
          odd composite allowed for Jacobi). Enter integers <em>a</em> and{' '}
          <em>p</em>.
        </p>
      </section>

      <form className="euclid-form jacobi-form" onSubmit={handleSubmit}>
        <div className="euclid-field">
          <label htmlFor="jacobi-a">a</label>
          <input
            id="jacobi-a"
            type="text"
            inputMode="numeric"
            value={aInput}
            onChange={(ev) => setAInput(ev.target.value)}
            aria-label="a"
          />
        </div>
        <div className="euclid-field">
          <label htmlFor="jacobi-p">p (odd, ≥ 3)</label>
          <input
            id="jacobi-p"
            type="text"
            inputMode="numeric"
            value={pInput}
            onChange={(ev) => setPInput(ev.target.value)}
            aria-label="p odd denominator"
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

      {result !== null ? (
        <aside
          className="euclid-answer jacobi-result"
          data-testid="jacobi-answer"
          aria-label="Jacobi symbol result"
        >
          <p className="euclid-answer-title">Result</p>
          <p className="euclid-answer-body jacobi-result-body">
            <span className="jacobi-fraction">
              <span className="jacobi-num">{aInput.trim() || 'a'}</span>
              <span className="jacobi-denom">{pInput.trim() || 'p'}</span>
            </span>{' '}
            = <strong>{formatSymbol(result)}</strong>
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default JacobiSymbolPage;
