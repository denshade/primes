import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PolynomialGcdPage from './PolynomialGcdPage';

describe('PolynomialGcdPage', () => {
  it('computes extended gcd and shows d(x), u(x), v(x)', async () => {
    render(<PolynomialGcdPage />);

    await userEvent.type(screen.getByLabelText('f(x)'), 'x^2-3x+2');
    await userEvent.type(screen.getByLabelText('g(x)'), 'x^2-1');
    await userEvent.click(
      screen.getByRole('button', { name: /compute extended gcd/i })
    );

    expect(screen.getByTestId('poly-gcd-steps').value).toMatch(/Step 1/);
    const answer = screen.getByTestId('poly-gcd-answer');
    expect(answer).toHaveTextContent('x - 1');
    expect(answer).toHaveTextContent('u(x)');
    expect(answer).toHaveTextContent('v(x)');
  });

  it('shows parse error for invalid input', async () => {
    render(<PolynomialGcdPage />);

    await userEvent.type(screen.getByLabelText('f(x)'), 'x^^2+1');
    await userEvent.type(screen.getByLabelText('g(x)'), 'x+1');
    await userEvent.click(
      screen.getByRole('button', { name: /compute extended gcd/i })
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid/i);
    expect(screen.queryByTestId('poly-gcd-answer')).not.toBeInTheDocument();
  });
});
