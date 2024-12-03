import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { checkboxSizes, checkboxTypes } from './helpers';

type Type = typeof Checkbox;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    label: 'Label',
    disabled: false,
    checkboxSize: 'md',
    type: 'checkbox',
    hasError: false,
  },
  argTypes: {
    checkboxSize: {
      options: checkboxSizes,
      control: { type: 'select' },
    },
    type: {
      options: checkboxTypes,
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
