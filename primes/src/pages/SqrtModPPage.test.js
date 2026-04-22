import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SqrtModPPage from './SqrtModPPage';

describe('SqrtModPPage', () => {
  it('shows square roots for a=2, p=7', async () => {
    render(<SqrtModPPage />);

    await userEvent.type(screen.getByLabelText('a'), '2');
    await userEvent.type(screen.getByLabelText(/p odd prime/i), '7');
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    const answer = screen.getByTestId('sqrt-mod-p-answer');
    expect(answer).toHaveTextContent('3');
    expect(answer).toHaveTextContent('4');
  });

  it('shows error when (a/p) ≠ +1', async () => {
    render(<SqrtModPPage />);

    await userEvent.type(screen.getByLabelText('a'), '3');
    await userEvent.type(screen.getByLabelText(/p odd prime/i), '7');
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/Jacobi|quadratic residue/i);
  });
});
