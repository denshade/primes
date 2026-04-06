import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JacobiSymbolPage from './JacobiSymbolPage';

describe('JacobiSymbolPage', () => {
  it('calculates (2/7) = +1', async () => {
    render(<JacobiSymbolPage />);

    await userEvent.type(screen.getByLabelText('a'), '2');
    await userEvent.type(screen.getByLabelText(/p odd denominator/i), '7');
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByTestId('jacobi-answer')).toHaveTextContent('+1');
  });

  it('shows error for even p', async () => {
    render(<JacobiSymbolPage />);

    await userEvent.type(screen.getByLabelText('a'), '1');
    await userEvent.type(screen.getByLabelText(/p odd denominator/i), '8');
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/odd/i);
  });
});
