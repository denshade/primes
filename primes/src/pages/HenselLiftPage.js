import { useState } from 'react';
import { henselLiftPolynomial } from '../utils/henselLift';
import './EuclidExtendedPage.css';
import './FpIrreduciblePage.css';

function HenselLiftPage() {
  const [pInput, setPInput] = useState('');
  const [fInput, setFInput] = useState('');
  const [r0Input, setR0Input] = useState('');
  const [kInput, setKInput] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setAnswer(null);

    const result = henselLiftPolynomial(pInput, fInput, r0Input, kInput);
    if (result.error) {
      setStepsText('');
      setError(result.error);
      return;
    }

    setStepsText(result.steps.join('\n'));
    setAnswer({
      r: result.r,
      p: result.p,
      k: result.k,
      modulus: result.modulus,
      fText: result.fText,
    });
  }

  return (
    <div className="page euclid-page">
      <p className="fp-irr-intro">
        <strong>Hensel lifting</strong> (simple-root case): if <em>f</em> ∈{' '}
        <strong>Z</strong>[<em>x</em>], <em>p</em> is prime,{' '}
        <em>f</em>(<em>r</em>₀) ≡ 0 (mod <em>p</em>), and{' '}
        <em>f</em>′(<em>r</em>₀) ≢ 0 (mod <em>p</em>), then there is a unique
        integer <em>r</em> modulo <em>p</em>
        <sup>k</sup> with <em>r</em> ≡ <em>r</em>₀ (mod <em>p</em>) and{' '}
        <em>f</em>(<em>r</em>) ≡ 0 (mod <em>p</em>
        <sup>k</sup>). The tool applies the Newton iteration{' '}
        <em>r</em> ← <em>r</em> − <em>f</em>(<em>r</em>)·(<em>f</em>′(
        <em>r</em>₀)⁻¹ mod <em>p</em>) modulo <em>p</em>
        <sup>m</sup> for <em>m</em> = 2, …, <em>k</em>.
      </p>

      <form className="fp-irr-form" onSubmit={handleSubmit}>
        <div className="euclid-field">
          <label htmlFor="hensel-p">p (prime)</label>
          <input
            id="hensel-p"
            type="number"
            min={2}
            step={1}
            value={pInput}
            onChange={(ev) => setPInput(ev.target.value)}
            aria-label="p prime"
          />
        </div>
        <div className="euclid-field">
          <label htmlFor="hensel-k">k (modulus p^k)</label>
          <input
            id="hensel-k"
            type="number"
            min={1}
            step={1}
            value={kInput}
            onChange={(ev) => setKInput(ev.target.value)}
            aria-label="k exponent"
          />
        </div>
        <div className="fp-irr-field">
          <label htmlFor="hensel-f">f(x)</label>
          <input
            id="hensel-f"
            type="text"
            className="fp-irr-f-input"
            value={fInput}
            onChange={(ev) => setFInput(ev.target.value)}
            placeholder="e.g. x^2 - 2"
            aria-label="f(x) polynomial"
          />
        </div>
        <div className="euclid-field">
          <label htmlFor="hensel-r0">r₀ (root mod p)</label>
          <input
            id="hensel-r0"
            type="text"
            inputMode="numeric"
            value={r0Input}
            onChange={(ev) => setR0Input(ev.target.value)}
            aria-label="r0 root modulo p"
          />
        </div>
        <p className="fp-irr-hint">
          Enter a residue <em>r</em>₀ with <em>f</em>(<em>r</em>₀) ≡ 0 (mod{' '}
          <em>p</em>) and <em>f</em>′(<em>r</em>₀) ≢ 0 (mod <em>p</em>). Coefficients
          of <em>f</em> are integers (same syntax as other polynomial tools).
        </p>
        <button type="submit" className="euclid-submit">
          Lift root mod p^k
        </button>
      </form>

      {error ? (
        <p className="euclid-error" role="alert">
          {error}
        </p>
      ) : null}

      <label className="euclid-output-label" htmlFor="hensel-steps">
        Steps
      </label>
      <textarea
        id="hensel-steps"
        className="euclid-steps"
        readOnly
        value={stepsText}
        data-testid="hensel-steps"
        placeholder="Submit to see each lift to mod p^m."
        rows={14}
      />

      {answer ? (
        <aside className="euclid-answer" data-testid="hensel-answer">
          <p className="euclid-answer-title">Answer</p>
          <p className="euclid-answer-body">
            For f(x) = {answer.fText}, the unique lift with r ≡ r₀ (mod p) satisfies
            r ={' '}
            <strong data-testid="hensel-r">{answer.r}</strong> (mod{' '}
            <span data-testid="hensel-modulus">{answer.modulus}</span> ={' '}
            <em>p</em>
            <sup>{answer.k}</sup>).
          </p>
        </aside>
      ) : null}
    </div>
  );
}

export default HenselLiftPage;
