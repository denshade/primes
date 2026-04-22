import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PolyRootsFpPage from './PolyRootsFpPage';

describe('PolyRootsFpPage', () => {
  it('lists roots for x^2 - 1 over F_5', async () => {
    render(<PolyRootsFpPage />);

    await userEvent.type(screen.getByLabelText('p prime'), '5');
    await userEvent.type(screen.getByLabelText('f(x) polynomial'), 'x^2 - 1');
    await userEvent.click(
      screen.getByRole('button', { name: /find roots in f_p/i })
    );

    expect(screen.getByTestId('poly-roots-fp-list')).toHaveTextContent('1, 4');
  });

  it('shows parse error for invalid polynomial', async () => {
    render(<PolyRootsFpPage />);

    await userEvent.type(screen.getByLabelText('p prime'), '5');
    await userEvent.type(screen.getByLabelText('f(x) polynomial'), 'x^^2');
    await userEvent.click(
      screen.getByRole('button', { name: /find roots in f_p/i })
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/invalid/i);
    expect(screen.queryByTestId('poly-roots-fp-answer')).not.toBeInTheDocument();
  });
});
