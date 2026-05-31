import type { Meta, StoryObj } from '@storybook/react';

import MapLayoutEditor from '.';

const meta = {
  title: 'mapping/MapLayoutEditor',
  component: MapLayoutEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof MapLayoutEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
