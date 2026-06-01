import type { Meta, StoryObj } from '@storybook/react-vite';
import { Autocomplete } from '@/components/autocomplete/Autocomplete';

const places = [
  {
    value: 'franz-josef',
    label: 'Franz Josef Glacier',
    description: 'West Coast, New Zealand',
  },
  {
    value: 'fox-glacier',
    label: 'Fox Glacier',
    description: 'Te Moeka o Tuawe',
  },
  {
    value: 'hokitika',
    label: 'Hokitika',
    description: 'River mouth and wild coast',
  },
  {
    value: 'arthurs-pass',
    label: "Arthur's Pass",
    description: 'Alpine village',
  },
  {
    value: 'lake-matheson',
    label: 'Lake Matheson',
    description: 'Mirror lake',
  },
];

const meta = {
  component: Autocomplete,
  args: {
    options: places,
    placeholder: 'Search places...',
  },
  decorators: [
    (Story) => (
      <div className='w-full max-w-sm p-6'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Autocomplete>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'fox-glacier',
  },
};
