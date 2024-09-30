import { Meta, StoryObj } from '@storybook/react';
import { Wallet } from './wallet';

type Type = typeof Wallet;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Wallet',
  component: Wallet,
};

const Vara: Story = {
  args: {},
};

const Gear: Story = {
  args: { variant: 'gear' },
};

export default meta;
export { Vara, Gear };
