import { Meta, StoryObj } from '@storybook/react';

import { Textarea } from './textarea';

type Type = typeof Textarea;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Textarea',
  component: Textarea,
  args: {
    label: '',
    size: 'medium',
    disabled: false,
    block: false,
    placeholder: 'Placeholder',
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
