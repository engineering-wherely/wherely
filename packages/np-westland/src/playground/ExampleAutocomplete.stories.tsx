import ExampleAutocomplete from '@/playground/ExampleAutocomplete';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: ExampleAutocomplete,
  decorators: [
    (Story) => (
      <div className='min-h-96 p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExampleAutocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
