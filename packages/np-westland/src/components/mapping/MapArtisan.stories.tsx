import MapArtisan from '@/components/mapping/MapArtisan';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: MapArtisan,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='fixed inset-0 h-dvh w-dvw overflow-hidden'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MapArtisan>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
