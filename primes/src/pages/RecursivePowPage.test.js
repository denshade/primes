import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecursivePowPage from './RecursivePowPage';

describe('RecursivePowPage', () => {
  it('shows steps and answer for 2^4', async () => {
    render(<RecursivePowPage />);

    await userEvent.type(screen.getByLabelText('x'), '2');
    await userEvent.type(screen.getByLabelText(/n \(power\)/i), '4');
    await userEvent.click(screen.getByRole('button', { name: /compute/i }));

    expect(screen.getByTestId('pow-steps').value).toMatch(/pow\(/);
    const answer = screen.getByTestId('pow-answer');
    expect(answer).toHaveTextContent('16');
  });

  it('shows error for negative n', async () => {
    render(<RecursivePowPage />);

    await userEvent.type(screen.getByLabelText('x'), '2');
    await userEvent.clear(screen.getByLabelText(/n \(power\)/i));
    await userEvent.type(screen.getByLabelText(/n \(power\)/i), '-1');
    await userEvent.click(screen.getByRole('button', { name: /compute/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/nonnegative/i);
    expect(screen.queryByTestId('pow-answer')).not.toBeInTheDocument();
  });
});
