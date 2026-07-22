import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Button, EmptyState, ErrorState, Input, Pagination, Tabs } from '@talent-lab/ui';

expect.extend(toHaveNoViolations);

describe('accessible UI components', () => {
  it('associates labels and dynamic errors with inputs', async () => {
    const { container } = render(<Input label="Candidate email" error="Email already exists" value="duplicate@example.test" readOnly />);
    const input = screen.getByRole('textbox', { name: 'Candidate email' });
    expect(input).toHaveAccessibleDescription('Email already exists');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('exposes loading and disabled states and prevents duplicate interaction', async () => {
    const onClick = vi.fn(); render(<Button loading onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button', { name: 'Loading…' });
    expect(button).toBeDisabled(); await userEvent.click(button); expect(onClick).not.toHaveBeenCalled();
  });

  it('renders empty and error states with the right live semantics', () => {
    const { rerender } = render(<EmptyState title="No candidates" description="Create the first candidate." />);
    expect(screen.getByRole('heading', { name: 'No candidates' })).toBeVisible();
    rerender(<ErrorState description="Network unavailable" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable');
  });

  it('supports keyboard navigation between tabs', async () => {
    render(<Tabs tabs={[{ id: 'one', label: 'One', content: 'First' }, { id: 'two', label: 'Two', content: 'Second' }]} />);
    const first = screen.getByRole('tab', { name: 'One' }); first.focus(); await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second');
  });

  it('announces pagination and disables boundary controls', async () => {
    const change = vi.fn(); render(<Pagination page={1} totalPages={3} onPageChange={change} />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next' })); expect(change).toHaveBeenCalledWith(2);
  });
});
