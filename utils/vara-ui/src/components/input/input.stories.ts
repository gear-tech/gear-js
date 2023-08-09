import { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';

type Type = typeof Input;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Input',
  component: Input,
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
