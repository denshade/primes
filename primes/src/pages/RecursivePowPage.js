import { useState } from 'react';
import { recursivePow } from '../utils/recursivePow';
import './EuclidExtendedPage.css';

function RecursivePowPage() {
  const [x, setX] = useState('');
  const [n, setN] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setAnswer(null);

    const result = recursivePow(x, n);
    if (result.error) {
      setStepsText('');
      setError(result.error);
      return;
    }

    setStepsText(result.steps.join('\n'));
    setAnswer({
      x: Number(x),
      n: Number(n),
      value: result.result,
    });
  }

  return (
    <div className="page euclid-page">
      <p className="euclid-intro">
        Recursive powering: compute xⁿ by recursive halving (even n) and factoring
        out one x (odd n).
      </p>

      <form className="euclid-form" onSubmit={handleSubmit}>
        <div className="euclid-field">
          <label htmlFor="pow-x">x</label>
          <input
            id="pow-x"
            name="x"
            type="number"
            step="any"
            value={x}
            onChange={(ev) => setX(ev.target.value)}
            aria-label="x"
          />
        </div>
        <div className="euclid-field">
          <label htmlFor="pow-n">n (power)</label>
          <input
            id="pow-n"
            name="n"
            type="number"
            step="1"
            min="0"
            value={n}
            onChange={(ev) => setN(ev.target.value)}
            aria-label="n (power)"
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

      <label className="euclid-output-label" htmlFor="pow-steps">
        Steps
      </label>
      <textarea
        id="pow-steps"
        className="euclid-steps"
        readOnly
        value={stepsText}
        placeholder="Submit to see each recursive call."
        data-testid="pow-steps"
        rows={14}
      />

      {answer ? (
        <aside
          className="euclid-answer"
          aria-label="Result"
          data-testid="pow-answer"
        >
          <p className="euclid-answer-title">Answer</p>
          <p className="euclid-answer-body">
            <strong>
              {answer.x}^{answer.n}
            </strong>{' '}
            = <strong>{answer.value}</strong>
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default RecursivePowPage;
