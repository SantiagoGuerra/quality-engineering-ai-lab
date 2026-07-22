import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { expect, it } from 'vitest';
import { StatusBadge } from '@talent-lab/ui';

expect.extend(toHaveNoViolations);

it('exposes candidate status as text and does not rely on color alone', async () => {
  const { container } = render(<StatusBadge label="Feedback pending" tone="warning" />);
  expect(screen.getByText('Feedback pending')).toBeVisible();
  expect(await axe(container)).toHaveNoViolations();
});
