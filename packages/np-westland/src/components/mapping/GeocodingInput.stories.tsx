import { GeocodingInput } from '@/components/mapping/GeocodingInput';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: GeocodingInput,
  decorators: [
    (Story) => (
      <div className='w-full max-w-sm p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GeocodingInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
