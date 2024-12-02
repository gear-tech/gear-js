import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

type Type = typeof Checkbox;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Checkbox',
  component: Checkbox,
  args: { label: 'Label' },
};

const Default: Story = {
  args: {},
};

const Switch: Story = {
  args: { type: 'switch' },
};

export default meta;
export { Default, Switch };
