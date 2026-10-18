import { PersonalDetailsCard } from '@/features/forms/personal-details/components/PersonalDetailsCard';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Forms/PersonalDetailsCard',
  component: PersonalDetailsCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-full max-w-xl p-4'>
        <Story />
      </div>
    ),
  ],
  args: {
    details: {
      firstName: 'Alex',
      lastName: 'Morgan',
      professionalTitle: 'Senior Software Engineer',
      location: 'Christchurch, New Zealand',
      linkedInUrl: 'https://www.linkedin.com/in/example',
      cvUrl: '/cv.pdf',
      emailAddress: 'alex.morgan@example.com',
      rightToWork: 'Eligible to work in New Zealand — no sponsorship required',
    },
  },
} satisfies Meta<typeof PersonalDetailsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className='w-64 max-w-full'>
        <Story />
      </div>
    ),
  ],
};
export const MissingDetails: Story = {
  args: {
    details: {
      firstName: '',
      lastName: '',
      professionalTitle: '',
      location: '',
      emailAddress: '',
      rightToWork: '',
    },
  },
};
export const LongDetails: Story = {
  args: {
    details: {
      ...meta.args.details,
      firstName: 'Alexandra',
      lastName: 'Morgan-Williams',
      emailAddress: 'alexandra.morgan-williams@example.com',
      professionalTitle:
        'Senior Software Engineer specialising in cloud infrastructure and distributed systems',
      location: 'Christchurch, Canterbury, New Zealand',
      rightToWork: 'Work visa with conditions — see supporting documentation',
    },
  },
};

export const EmailOnly: Story = {
  args: { details: { ...meta.args.details, linkedInUrl: undefined, cvUrl: undefined } },
};
