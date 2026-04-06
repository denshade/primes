import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('closes the tools dropdown after clicking a menu link', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const summary = screen.getByText(/number theoretical tools/i);
    await userEvent.click(summary);
    const details = summary.closest('details');
    expect(details.open).toBe(true);

    await userEvent.click(
      screen.getByRole('menuitem', { name: /euclid algorithm extended/i })
    );
    expect(details.open).toBe(false);
  });
});
