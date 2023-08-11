import { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

type Type = typeof Textarea;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Textarea',
  component: Textarea,
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
