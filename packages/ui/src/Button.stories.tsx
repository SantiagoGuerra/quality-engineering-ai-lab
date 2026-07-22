import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './components.js';

const meta = { title: 'Design System/Button', component: Button, tags: ['autodocs'], args: { children: 'Save candidate' } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const Error: Story = { args: { variant: 'danger', children: 'Delete candidate' } };
export const Small: Story = { args: { size: 'small' } };
export const Large: Story = { args: { size: 'large' } };
export const HighContrast: Story = { parameters: { backgrounds: { default: 'dark' } } };
