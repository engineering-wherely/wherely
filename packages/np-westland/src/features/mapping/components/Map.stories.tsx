import { Map } from '@/features/mapping/components/Map';
import { View } from '@/features/mapping/components/View';
import { fromLonLat, toGeograhicCoordinate } from '@/features/mapping/utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: Map,
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
} satisfies Meta<typeof Map>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: (
      <View
        center={fromLonLat(toGeograhicCoordinate([172.62, -43.53]), 'EPSG:3857')}
        projection='EPSG:3857'
        zoom={14}
      />
    ),
  },
};
