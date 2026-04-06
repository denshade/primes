import { useState } from 'react';
import { extendedEuclid } from '../utils/extendedEuclid';
import './EuclidExtendedPage.css';

function EuclidExtendedPage() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setAnswer(null);

    const result = extendedEuclid(a, b);
    if (result.error) {
      setStepsText('');
      setError(result.error);
      return;
    }

    setStepsText(result.steps.join('\n'));
    setAnswer({
      gcd: result.gcd,
      x: result.x,
      y: result.y,
      a: Number(a),
      b: Number(b),
    });
  }

  return (
    <div className="page euclid-page">
      <p className="euclid-intro">
        euclid algorithm extended for gcd and inverse.
      </p>

      <form className="euclid-form" onSubmit={handleSubmit}>
        <div className="euclid-field">
          <label htmlFor="euclid-a">a</label>
          <input
            id="euclid-a"
            name="a"
            type="number"
            step="1"
            value={a}
            onChange={(ev) => setA(ev.target.value)}
            aria-label="a"
          />
        </div>
        <div className="euclid-field">
          <label htmlFor="euclid-b">b</label>
          <input
            id="euclid-b"
            name="b"
            type="number"
            step="1"
            value={b}
            onChange={(ev) => setB(ev.target.value)}
            aria-label="b"
          />
        </div>
        <button type="submit" className="euclid-submit">
          Compute
        </button>
      </form>

      {error ? (
        <p className="euclid-error" role="alert">
          {error}
        </p>
      ) : null}

      <label className="euclid-output-label" htmlFor="euclid-steps">
        Steps
      </label>
      <textarea
        id="euclid-steps"
        className="euclid-steps"
        readOnly
        value={stepsText}
        placeholder="Submit the form to see each division step and updates to r, s, t."
        data-testid="euclid-steps"
        rows={14}
      />

      {answer ? (
        <aside
          className="euclid-answer"
          aria-label="Result"
          data-testid="euclid-answer"
        >
          <p className="euclid-answer-title">Answer</p>
          <p className="euclid-answer-body">
            gcd({answer.a}, {answer.b}) = <strong>{answer.gcd}</strong>
            {' — '}
            Bézout: <strong>x = {answer.x}</strong>,{' '}
            <strong>y = {answer.y}</strong>
            {' '}
            (so {answer.a}·{answer.x} + {answer.b}·{answer.y} ={' '}
            <strong>{answer.gcd}</strong>)
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default EuclidExtendedPage;
