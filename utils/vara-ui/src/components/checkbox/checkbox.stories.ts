import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

type Type = typeof Checkbox;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    label: 'Label',
    disabled: false,
    size: 'default',
    type: 'checkbox',
    error: undefined,
  },
  argTypes: {
    size: {
      options: ['small', 'default'],
      control: { type: 'select' },
    },
    type: {
      options: ['checkbox', 'switch'],
      control: { type: 'select' },
    },
  },
};

const Default: Story = {
  args: {},
};

const Switch: Story = {
  args: { type: 'switch' },
};

export default meta;
export { Default, Switch };
