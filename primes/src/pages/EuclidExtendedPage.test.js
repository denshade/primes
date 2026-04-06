import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EuclidExtendedPage from './EuclidExtendedPage';

describe('EuclidExtendedPage', () => {
  it('shows steps and highlighted answer after compute', async () => {
    render(<EuclidExtendedPage />);

    await userEvent.type(screen.getByLabelText('a'), '35');
    await userEvent.type(screen.getByLabelText('b'), '15');
    await userEvent.click(screen.getByRole('button', { name: /compute/i }));

    const steps = screen.getByTestId('euclid-steps');
    expect(steps.value).toMatch(/Step 1/);
    expect(steps.value.length).toBeGreaterThan(20);

    const answer = screen.getByTestId('euclid-answer');
    expect(answer).toHaveTextContent('gcd(35, 15)');
    expect(answer).toHaveTextContent('5');
    expect(answer).toHaveTextContent('x =');
    expect(answer).toHaveTextContent('y =');
  });

  it('shows error for gcd(0,0)', async () => {
    render(<EuclidExtendedPage />);

    await userEvent.clear(screen.getByLabelText('a'));
    await userEvent.clear(screen.getByLabelText('b'));
    await userEvent.type(screen.getByLabelText('a'), '0');
    await userEvent.type(screen.getByLabelText('b'), '0');
    await userEvent.click(screen.getByRole('button', { name: /compute/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/undefined/i);
    expect(screen.queryByTestId('euclid-answer')).not.toBeInTheDocument();
  });
});
