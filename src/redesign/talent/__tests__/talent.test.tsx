import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainProvider } from '../../domain/DomainProvider';
import TalentFinder from '../TalentFinder';

describe('Talent Finder', () => {
  beforeEach(() => localStorage.clear());
  it('filters, changes view, compares, and starts a collaboration', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<DomainProvider><TalentFinder notify={vi.fn()} navigate={navigate} /></DomainProvider>);
    await user.selectOptions(screen.getByLabelText(/filter by skill/i), 'Film');
    expect(screen.getByText('Leo M.')).toBeVisible();
    expect(screen.queryByText('Nia S.')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /list view/i }));
    expect(screen.getByLabelText(/talent results/i)).toHaveClass('talent-list');
    await user.click(screen.getByRole('button', { name: /compare leo/i }));
    expect(screen.getByText(/1 creative selected/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: /collaborate with leo/i }));
    expect(navigate).toHaveBeenCalledWith('inbox');
  });
});
