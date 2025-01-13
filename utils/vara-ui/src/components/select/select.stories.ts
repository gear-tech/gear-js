import { Meta, StoryObj } from '@storybook/react';

import { Select } from './select';

type Type = typeof Select;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Select',
  component: Select,
  args: {
    options: [
      { label: 'Option 1', value: 'option-1' },
      { label: 'Option 2', value: 'option-2' },
      { label: 'Option 3', value: 'option-3' },
    ],
    label: '',
    size: 'medium',
    disabled: false,
    block: false,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    block: { control: 'boolean' },
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },
  },
};

const Default: Story = {
  args: {},
};

const Label: Story = {
  args: { label: 'Label' },
};

const DefaultError: Story = {
  args: { error: 'Error Message' },
};

const LabelError: Story = {
  args: { label: 'Label', error: 'Error Message' },
};

export default meta;
export { Default, Label, DefaultError, LabelError };
