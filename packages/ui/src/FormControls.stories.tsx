import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Input, Select } from './components.js';

const meta = { title: 'Design System/Form controls', component: Input, tags: ['autodocs'], args: { label: 'Email' } } satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const InputDefault: Story = { args: { label: 'Email', type: 'email', hint: 'Use a test address only' } };
export const InputDisabled: Story = { args: { label: 'Email', disabled: true, value: 'disabled@example.test', readOnly: true } };
export const InputError: Story = { args: { label: 'Email', error: 'Enter a valid email', value: 'bad', readOnly: true } };
export const SelectDefault: Story = { render: () => <Select label="Role" options={[{ value: 'recruiter', label: 'Recruiter' }, { value: 'reviewer', label: 'Reviewer' }]} /> };
export const SelectDisabled: Story = { render: () => <Select label="Role" disabled options={[{ value: 'recruiter', label: 'Recruiter' }]} /> };
export const SelectError: Story = { render: () => <Select label="Role" error="Select a role" options={[{ value: '', label: 'Choose…' }]} /> };
export const CheckboxDefault: Story = { render: () => <Checkbox label="Send invitation" /> };
export const CheckboxDisabled: Story = { render: () => <Checkbox label="Send invitation" disabled /> };
