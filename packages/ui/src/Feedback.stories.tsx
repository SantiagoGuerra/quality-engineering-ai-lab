import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert, Button, EmptyState, ErrorState, LoadingIndicator, Toast } from './components.js';

const meta = { title: 'Design System/Feedback', component: Alert, tags: ['autodocs'], args: { children: 'Status message' } } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Info: Story = { args: { children: 'Interview scheduled' } };
export const Success: Story = { args: { children: 'Candidate saved', tone: 'success' } };
export const Error: Story = { args: { children: 'The network is unavailable', tone: 'error' } };
export const Loading: Story = { render: () => <LoadingIndicator label="Loading candidates" /> };
export const Empty: Story = { render: () => <EmptyState title="No candidates" description="Create the first candidate for this project." action={<Button>Create candidate</Button>} /> };
export const ErrorStateStory: Story = { render: () => <ErrorState description="Candidate data could not be loaded." onRetry={() => undefined} /> };
export const ToastStory: Story = { render: () => <Toast>Candidate saved</Toast> };
