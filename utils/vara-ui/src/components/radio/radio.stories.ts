import { Meta, StoryObj } from '@storybook/react';
import { Radio } from './radio';
import { radioSizes } from './helpers';

type Type = typeof Radio;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Radio',
  component: Radio,
  args: {
    label: 'Label',
    disabled: false,
    // checked: false,
  },
  argTypes: {
    size: {
      options: radioSizes,
      control: { type: 'select' },
    },
    disabled: { control: 'boolean' },
    // checked: { control: 'boolean' },
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
