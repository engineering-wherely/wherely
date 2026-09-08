import { GetStartedControl } from '@/features/mapping/components/GetStartedControl';
import { Map } from '@/features/mapping/components/Map';
import { View } from '@/features/mapping/components/View';
import { fromLonLat, toGeograhicCoordinate } from '@/features/mapping/utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

const center = fromLonLat(toGeograhicCoordinate([172.62, -43.53]), 'EPSG:3857');

const meta = {
  component: GetStartedControl,
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
  title: 'Mapping/GetStartedControl',
} satisfies Meta<typeof GetStartedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    firstName: 'Aoraki',
    lastName: 'Cook',
  },
};
