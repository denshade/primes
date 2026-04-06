import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChineseRemainderPage from './ChineseRemainderPage';

describe('ChineseRemainderPage', () => {
  it('finds n for 3,5,7 with residues 2,3,2', async () => {
    render(<ChineseRemainderPage />);

    await userEvent.click(screen.getByRole('button', { name: /add congruence/i }));
    await userEvent.click(screen.getByRole('button', { name: /add congruence/i }));

    const mInputs = screen.getAllByLabelText(/modulus m for congruence/i);
    const nInputs = screen.getAllByLabelText(/residue n for congruence/i);

    await userEvent.type(mInputs[0], '3');
    await userEvent.type(nInputs[0], '2');
    await userEvent.type(mInputs[1], '5');
    await userEvent.type(nInputs[1], '3');
    await userEvent.type(mInputs[2], '7');
    await userEvent.type(nInputs[2], '2');

    await userEvent.click(screen.getByRole('button', { name: /^find n$/i }));

    expect(screen.getByTestId('crt-steps').value).toMatch(/M =/);
    expect(screen.getByTestId('crt-answer')).toHaveTextContent('23');
    expect(screen.getByTestId('crt-answer')).toHaveTextContent('105');
  });

  it('shows error when moduli are not coprime', async () => {
    render(<ChineseRemainderPage />);

    await userEvent.type(
      screen.getByLabelText(/modulus m for congruence 1/i),
      '4'
    );
    await userEvent.type(
      screen.getByLabelText(/residue n for congruence 1/i),
      '1'
    );
    await userEvent.click(screen.getByRole('button', { name: /add congruence/i }));
    await userEvent.type(
      screen.getByLabelText(/modulus m for congruence 2/i),
      '6'
    );
    await userEvent.type(
      screen.getByLabelText(/residue n for congruence 2/i),
      '1'
    );
    await userEvent.click(screen.getByRole('button', { name: /^find n$/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/coprime/i);
    expect(screen.queryByTestId('crt-answer')).not.toBeInTheDocument();
  });
});
