import type { Meta, StoryObj } from '@storybook/react-vite';

import CommandMenu from './CommandMenu';

const meta = {
  component: CommandMenu,
  decorators: [
    (Story) => (
      <div className='min-h-80 w-full bg-background p-6 text-foreground'>
        <div className='mx-auto w-full max-w-md rounded-lg border bg-popover p-2 shadow-sm'>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof CommandMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Compact: Story = {
  decorators: [
    (Story) => (
      <div className='min-h-64 w-full bg-background p-4 text-foreground'>
        <div className='mx-auto w-full max-w-64 rounded-lg border bg-popover p-2 shadow-sm'>
          <Story />
        </div>
      </div>
    ),
  ],
};
