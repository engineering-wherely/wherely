import { Map } from '@/features/mapping/components/Map';
import { Popup } from '@/features/mapping/components/Popup';
import { View } from '@/features/mapping/components/View';
import { fromLonLat, toGeograhicCoordinate } from '@/features/mapping/utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

const center = fromLonLat(toGeograhicCoordinate([172.62, -43.53]), 'EPSG:3857');

const meta = {
  component: Popup,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className='fixed inset-0 h-dvh w-dvw overflow-hidden'>
        <Map>
          <View
            center={center}
            projection='EPSG:3857'
            zoom={14}
          />
          <Story />
        </Map>
      </div>
    ),
  ],
  title: 'Mapping/Popup',
} satisfies Meta<typeof Popup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Get started as Matthew Gong',
    coordinate: center,
  },
};

export const Multiline: Story = {
  args: {
    children: (
      <span>
        Get started as Matthew Gong with a longer message that wraps across multiple lines.
      </span>
    ),
    coordinate: center,
  },
};
