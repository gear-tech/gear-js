import { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

type ButtonType = typeof Button;
type Story = StoryObj<ButtonType>;

const meta: Meta<ButtonType> = {
  title: 'Button',
  component: Button,
  args: { children: 'Button', text: 'Button', isLoading: true },
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
