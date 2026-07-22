import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog, Input } from './components.js';

const meta = { title: 'Design System/Dialog', component: Dialog, tags: ['autodocs'], args: { open: false, title: 'Dialog', onClose: () => undefined, children: null } } satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { open: true, title: 'Create candidate', onClose: () => undefined, children: <Input label="Candidate email" type="email" /> } };
export const KeyboardFocus: Story = { render: () => { const Example = () => { const [open, setOpen] = useState(false); return <><Button onClick={() => setOpen(true)}>Open dialog</Button><Dialog open={open} title="Keyboard focus demo" onClose={() => setOpen(false)} footer={<Button onClick={() => setOpen(false)}>Save</Button>}><Input label="Name" data-dialog-initial-focus /></Dialog></>; }; return <Example />; } };
export const Error: Story = { args: { open: true, title: 'Create candidate', onClose: () => undefined, children: <Input label="Candidate email" error="Email already exists" value="duplicate@example.test" readOnly /> } };
export const Responsive: Story = { args: { open: true, title: 'Responsive dialog', onClose: () => undefined, children: 'This dialog adapts to narrow screens.' }, parameters: { viewport: { defaultViewport: 'mobile1' } } };
