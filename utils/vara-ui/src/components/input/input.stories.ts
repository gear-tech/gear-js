import { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

type Type = typeof Input;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Input',
  component: Input,
  args: {
    label: '',
    size: 'medium',
    icon: undefined,
    disabled: false,
    block: false,
    type: 'text',
    placeholder: 'Placeholder',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    block: { control: 'boolean' },
    size: {
      options: ['large', 'medium', 'small'],
      control: { type: 'select' },
    },
    type: { control: 'select', options: ['text', 'number', 'password', 'email'] },
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
