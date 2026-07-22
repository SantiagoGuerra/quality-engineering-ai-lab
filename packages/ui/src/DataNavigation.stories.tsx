import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination, Table, Tabs } from './components.js';

const meta = { title: 'Design System/Data and navigation', component: Table, tags: ['autodocs'], args: { caption: 'Data', columns: [], rows: [] } } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;
export const TableDefault: Story = { args: { caption: 'Candidates', columns: ['Name', 'Email'], rows: [['Alex Rivera', 'alex@example.test'], ['Zoë O’Connor-李', 'zoe@example.test']] } };
export const TableEmpty: Story = { args: { caption: 'Candidates', columns: ['Name', 'Email'], rows: [] } };
export const PaginationDefault: Story = { render: () => <Pagination page={2} totalPages={5} onPageChange={() => undefined} /> };
export const PaginationDisabledEdges: Story = { render: () => <Pagination page={1} totalPages={1} onPageChange={() => undefined} /> };
export const TabsKeyboard: Story = { render: () => <Tabs tabs={[{ id: 'summary', label: 'Summary', content: 'Summary panel' }, { id: 'evaluation', label: 'Evaluation', content: 'Evaluation panel' }]} /> };
