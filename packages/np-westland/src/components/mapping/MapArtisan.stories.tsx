import MapArtisan from '@/components/mapping/MapArtisan';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: MapArtisan,
} satisfies Meta<typeof MapArtisan>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
