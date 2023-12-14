import { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

type Type = typeof Button;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Button',
  component: Button,
  args: { children: 'Button' },
};

const Primary: Story = {
  args: {},
};

const Dark: Story = {
  args: {
    color: 'dark',
  },
};

const Light: Story = {
  args: {
    color: 'light',
  },
};

const Border: Story = {
  args: {
    color: 'border',
  },
};

export default meta;
export { Primary, Dark, Light, Border };
