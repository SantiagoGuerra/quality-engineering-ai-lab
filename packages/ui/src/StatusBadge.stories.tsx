import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from './StatusBadge.js';

const meta = {
  title: 'Design System/Status Badge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: { label: 'Interview scheduled', tone: 'success' },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {};
export const Warning: Story = { args: { label: 'Feedback pending', tone: 'warning' } };
export const Danger: Story = { args: { label: 'Interview cancelled', tone: 'danger' } };
