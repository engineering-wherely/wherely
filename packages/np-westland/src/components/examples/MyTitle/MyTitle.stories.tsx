import type { Meta, StoryObj } from '@storybook/react';

import { MyTitle } from '.';

const meta = {
  title: 'examples/MyTitle',
  component: MyTitle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    title: 'Title',
  },
} satisfies Meta<typeof MyTitle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
  },
};
