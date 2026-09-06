import { GetStartedButton } from '@/features/mapping/components/GetStartedButton';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  component: GetStartedButton,
  decorators: [
    (Story) => (
      <div className='p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GetStartedButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    firstName: 'Aoraki',
    lastName: 'Cook',
  },
};
