import { useState } from 'react';
import { polynomialExtendedGcd } from '../utils/polynomialGcd';
import './EuclidExtendedPage.css';
import './PolynomialGcdPage.css';

function PolynomialGcdPage() {
  const [fInput, setFInput] = useState('');
  const [gInput, setGInput] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setAnswer(null);

    const result = polynomialExtendedGcd(fInput, gInput);
    if (result.error) {
      setStepsText('');
      setError(result.error);
      return;
    }

    setStepsText(result.steps.join('\n'));
    setAnswer({
      fText: result.fText,
      gText: result.gText,
      dText: result.dText,
      uText: result.uText,
      vText: result.vText,
    });
  }

  return (
    <div className="page euclid-page">
      <p className="poly-gcd-intro">
        Extended gcd in ℝ[x]: enter f(x) and g(x), then find d(x) = gcd(f, g) and
        polynomials u(x), v(x) with u(x)·f(x) + v(x)·g(x) = d(x) (d monic).
      </p>

      <form className="poly-gcd-form" onSubmit={handleSubmit}>
        <div className="poly-gcd-field">
          <label htmlFor="poly-f">f(x)</label>
          <input
            id="poly-f"
            type="text"
            value={fInput}
            onChange={(ev) => setFInput(ev.target.value)}
            placeholder="e.g. x^2 - 3x + 2"
          />
        </div>
        <div className="poly-gcd-field">
          <label htmlFor="poly-g">g(x)</label>
          <input
            id="poly-g"
            type="text"
            value={gInput}
            onChange={(ev) => setGInput(ev.target.value)}
            placeholder="e.g. x^2 - 1"
          />
        </div>
        <p className="poly-gcd-hint">
          Supported format: terms like 3x^2, -x, +4. Use integer/decimal coefficients.
        </p>
        <button type="submit" className="euclid-submit">
          Compute extended gcd
        </button>
      </form>

      {error ? (
        <p className="euclid-error" role="alert">
          {error}
        </p>
      ) : null}

      <label className="euclid-output-label" htmlFor="poly-gcd-steps">
        Steps
      </label>
      <textarea
        id="poly-gcd-steps"
        className="euclid-steps"
        readOnly
        value={stepsText}
        data-testid="poly-gcd-steps"
        placeholder="Submit to see each division and Bézout coefficient update."
        rows={14}
      />

      {answer ? (
        <aside className="euclid-answer" data-testid="poly-gcd-answer">
          <p className="euclid-answer-title">Answer</p>
          <p className="euclid-answer-body">
            d(x) = gcd(f, g) = <strong>{answer.dText}</strong>
          </p>
          <p className="euclid-answer-body poly-gcd-bezout">
            u(x) = <strong>{answer.uText}</strong>, v(x) ={' '}
            <strong>{answer.vText}</strong>
          </p>
          <p className="euclid-answer-body poly-gcd-bezout">
            u(x)·f(x) + v(x)·g(x) = d(x) with f(x) = {answer.fText}, g(x) ={' '}
            {answer.gText}.
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default PolynomialGcdPage;
