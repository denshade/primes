import { useState } from 'react';
import { chineseRemainder } from '../utils/chineseRemainder';
import './EuclidExtendedPage.css';
import './ChineseRemainderPage.css';

function emptyPair() {
  return { m: '', n: '' };
}

function ChineseRemainderPage() {
  const [pairs, setPairs] = useState([emptyPair()]);
  const [stepsText, setStepsText] = useState('');
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');

  function handlePairChange(index, field, value) {
    setPairs((prev) => {
      const next = prev.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      );
      return next;
    });
  }

  function addPair() {
    setPairs((prev) => [...prev, emptyPair()]);
  }

  function removeLastPair() {
    setPairs((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setAnswer(null);

    const moduliStr = pairs.map((p) => p.m);
    const residuesStr = pairs.map((p) => p.n);
    const result = chineseRemainder(moduliStr, residuesStr);

    if (result.error) {
      setStepsText('');
      setError(result.error);
      return;
    }

    setStepsText(result.steps.join('\n'));
    setAnswer({
      n: result.n.toString(),
      M: result.M.toString(),
      r: pairs.length,
    });
  }

  return (
    <div className="page euclid-page">
      <p className="crt-intro">
        Chinese remainder theorem: pairwise coprime moduli{' '}
        <em>m</em>₁,…,<em>m</em>ᵣ and residues <em>n</em>₁,…,<em>n</em>ᵣ. Find
        the unique <em>n</em> modulo <em>M</em> = <em>m</em>₁⋯<em>m</em>ᵣ
        with <em>n</em> ≡ <em>n</em>ᵢ (mod <em>m</em>ᵢ) for each <em>i</em>.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="crt-pairs">
          {pairs.map((pair, i) => (
            <div key={i} className="crt-pair-row">
              <span className="crt-pair-index" aria-hidden>
                {i + 1}.
              </span>
              <div className="euclid-field">
                <label htmlFor={`crt-m-${i}`}>m (modulus)</label>
                <input
                  id={`crt-m-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={pair.m}
                  onChange={(ev) =>
                    handlePairChange(i, 'm', ev.target.value)
                  }
                  aria-label={`modulus m for congruence ${i + 1}`}
                  placeholder="e.g. 7"
                />
              </div>
              <div className="euclid-field">
                <label htmlFor={`crt-n-${i}`}>n (residue)</label>
                <input
                  id={`crt-n-${i}`}
                  type="text"
                  inputMode="numeric"
                  value={pair.n}
                  onChange={(ev) =>
                    handlePairChange(i, 'n', ev.target.value)
                  }
                  aria-label={`residue n for congruence ${i + 1}`}
                  placeholder="e.g. 2"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="crt-actions">
          <button type="button" onClick={addPair}>
            Add congruence
          </button>
          <button
            type="button"
            onClick={removeLastPair}
            disabled={pairs.length <= 1}
          >
            Remove last
          </button>
          <button type="submit" className="crt-btn-primary">
            Find n
          </button>
        </div>
      </form>

      {error ? (
        <p className="euclid-error" role="alert">
          {error}
        </p>
      ) : null}

      <label className="euclid-output-label" htmlFor="crt-steps">
        Steps
      </label>
      <textarea
        id="crt-steps"
        className="euclid-steps"
        readOnly
        value={stepsText}
        placeholder="Submit to see M, each term nᵢ·Mᵢ·(Mᵢ⁻¹ mod mᵢ), and the combined n."
        data-testid="crt-steps"
        rows={14}
      />

      {answer ? (
        <aside
          className="euclid-answer"
          aria-label="Result"
          data-testid="crt-answer"
        >
          <p className="euclid-answer-title">Answer</p>
          <p className="euclid-answer-body">
            Unique solution modulo <strong>M = {answer.M}</strong> (with{' '}
            <strong>r = {answer.r}</strong> coprime moduli):{' '}
            <strong>n = {answer.n}</strong>
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default ChineseRemainderPage;
