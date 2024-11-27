import { Meta, StoryObj } from '@storybook/react';
import { Button, buttonColors, buttonSizes } from './button';
import ArrowIcon from '../../assets/images/arrow-right.svg?react';
import LightningIcon from '../../assets/images/lightning.svg?react';

type Type = typeof Button;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Button',
  component: Button,
  args: {
    children: 'Click me!',
    color: 'primary',
    size: 'default',
    disabled: false,
    isLoading: false,
    block: false,
    noWrap: false,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    block: { control: 'boolean' },
    noWrap: { control: 'boolean' },
    size: {
      options: buttonSizes,
      control: { type: 'select' },
    },
    color: {
      options: buttonColors,
      control: { type: 'select' },
    },
  },
};

export const Default: Story = {};
export const Border: Story = { args: { color: 'border' } };
export const Grey: Story = { args: { color: 'grey' } };
export const Transparent: Story = { args: { color: 'transparent' } };
export const Dark: Story = { args: { color: 'dark' } };
export const Light: Story = { args: { color: 'light' } };
export const Destructive: Story = { args: { color: 'destructive' } };
export const NoText: Story = { args: { color: 'primary', children: undefined, icon: ArrowIcon } };
export const WithChildrenAndIcons: Story = {
  args: {
    color: 'primary',
    children: (
      <>
        <LightningIcon />
        Hello!
        <LightningIcon />
      </>
    ),
  },
};

export default meta;
