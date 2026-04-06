import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FpIrreduciblePage from './FpIrreduciblePage';

describe('FpIrreduciblePage', () => {
  it('shows irreducible for x^2+x+1 over F_2', async () => {
    render(<FpIrreduciblePage />);

    await userEvent.type(screen.getByLabelText(/p prime/i), '2');
    await userEvent.type(screen.getByLabelText(/f\(x\) polynomial/i), 'x^2+x+1');
    await userEvent.click(
      screen.getByRole('button', { name: /test irreducibility/i })
    );

    expect(screen.getByTestId('fp-irr-steps').value).toMatch(/Algorithm: g\(x\)=x/);
    expect(screen.getByTestId('fp-irr-answer')).toHaveTextContent(/irreducible/i);
  });

  it('shows error for invalid p', async () => {
    render(<FpIrreduciblePage />);

    await userEvent.type(screen.getByLabelText(/p prime/i), '4');
    await userEvent.type(screen.getByLabelText(/f\(x\) polynomial/i), 'x^2+1');
    await userEvent.click(
      screen.getByRole('button', { name: /test irreducibility/i })
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/prime/i);
  });
});
