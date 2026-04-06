import { useState } from 'react';
import { irreducibilityTestFp } from '../utils/fpIrreducible';
import './EuclidExtendedPage.css';
import './FpIrreduciblePage.css';

function FpIrreduciblePage() {
  const [pInput, setPInput] = useState('');
  const [fInput, setFInput] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setAnswer(null);

    const result = irreducibilityTestFp(pInput, fInput);
    if (result.error) {
      setStepsText('');
      setError(result.error);
      return;
    }

    setStepsText(result.steps.join('\n'));
    setAnswer({
      irreducible: result.irreducible,
      fText: result.fText,
      p: result.p,
      degree: result.degree,
    });
  }

  return (
    <div className="page euclid-page">
      <p className="fp-irr-intro">
        Irreducibility test over <strong>F<sub>p</sub></strong>[x]: enter a prime{' '}
        <em>p</em> and a polynomial <em>f</em>(<em>x</em>) of degree{' '}
        <em>k</em> ≥ 2 with coefficients reduced modulo <em>p</em>. Uses the
        iterative Frobenius + gcd loop.
      </p>

      <form className="fp-irr-form" onSubmit={handleSubmit}>
        <div className="euclid-field">
          <label htmlFor="fp-p">p (prime)</label>
          <input
            id="fp-p"
            type="number"
            min={2}
            step={1}
            value={pInput}
            onChange={(ev) => setPInput(ev.target.value)}
            aria-label="p prime"
          />
        </div>
        <div className="fp-irr-field">
          <label htmlFor="fp-f">f(x)</label>
          <input
            id="fp-f"
            type="text"
            className="fp-irr-f-input"
            value={fInput}
            onChange={(ev) => setFInput(ev.target.value)}
            placeholder="e.g. x^2 + x + 1"
            aria-label="f(x) polynomial"
          />
        </div>
        <p className="fp-irr-hint">
          Coefficients are interpreted as integers and reduced mod p. Degree must
          be at least 2 after reduction.
        </p>
        <button type="submit" className="euclid-submit">
          Test irreducibility
        </button>
      </form>

      {error ? (
        <p className="euclid-error" role="alert">
          {error}
        </p>
      ) : null}

      <label className="euclid-output-label" htmlFor="fp-irr-steps">
        Steps
      </label>
      <textarea
        id="fp-irr-steps"
        className="euclid-steps"
        readOnly
        value={stepsText}
        data-testid="fp-irr-steps"
        placeholder="Submit to see Rabin conditions and gcd checks."
        rows={14}
      />

      {answer ? (
        <aside className="euclid-answer" data-testid="fp-irr-answer">
          <p className="euclid-answer-title">Answer</p>
          <p className="euclid-answer-body">
            Over F<sub>{answer.p}</sub>, f(x) = {answer.fText} (degree {answer.degree}) is{' '}
            <strong>
              {answer.irreducible ? 'irreducible' : 'reducible'}
            </strong>
            .
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default FpIrreduciblePage;
