import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HenselLiftPage from './HenselLiftPage';

describe('HenselLiftPage', () => {
  it('computes lift for x^2 - 2 mod 7^2', async () => {
    render(<HenselLiftPage />);

    await userEvent.type(screen.getByLabelText('p prime'), '7');
    await userEvent.type(screen.getByLabelText('k exponent'), '2');
    await userEvent.type(screen.getByLabelText('f(x) polynomial'), 'x^2 - 2');
    await userEvent.type(screen.getByLabelText('r0 root modulo p'), '3');
    await userEvent.click(
      screen.getByRole('button', { name: /lift root mod p\^k/i })
    );

    expect(screen.getByTestId('hensel-r')).toHaveTextContent('10');
    expect(screen.getByTestId('hensel-modulus')).toHaveTextContent('49');
    expect(screen.getByTestId('hensel-steps').value).toMatch(/p\^2/);
  });

  it('shows error for invalid polynomial', async () => {
    render(<HenselLiftPage />);

    await userEvent.type(screen.getByLabelText('p prime'), '7');
    await userEvent.type(screen.getByLabelText('k exponent'), '2');
    await userEvent.type(screen.getByLabelText('f(x) polynomial'), 'x^^');
    await userEvent.type(screen.getByLabelText('r0 root modulo p'), '3');
    await userEvent.click(
      screen.getByRole('button', { name: /lift root mod p\^k/i })
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid/i);
    expect(screen.queryByTestId('hensel-answer')).not.toBeInTheDocument();
  });
});
