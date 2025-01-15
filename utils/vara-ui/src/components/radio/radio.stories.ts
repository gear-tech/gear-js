import { Meta, StoryObj } from '@storybook/react';

import { Radio } from './radio';

type Type = typeof Radio;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Radio',
  component: Radio,
  args: {
    label: 'Label',
    disabled: false,
    error: undefined,
  },
  argTypes: {
    size: {
      options: ['small', 'default'],
      control: { type: 'select' },
    },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
  },
};

const Default: Story = {
  args: {},
};

const Checked: Story = {
  args: { checked: true },
};

export default meta;
export { Default, Checked };
