import { Meta, StoryObj } from '@storybook/react';

import CrossSVG from '../../assets/images/cross.svg?react';
import { Button } from './button';

type Type = typeof Button;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Button',
  component: Button,
  args: {
    text: 'Click me!',
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
      options: ['x-small', 'small', 'medium', 'default', 'x-large'],
      control: { type: 'radio' },
    },
    color: {
      options: ['primary', 'plain', 'contrast', 'grey', 'border', 'transparent', 'danger'],
      control: { type: 'radio' },
    },
  },
};

const Default: Story = {};
const Border: Story = { args: { color: 'border' } };
const Grey: Story = { args: { color: 'grey' } };
const Transparent: Story = { args: { color: 'transparent' } };
const Contrast: Story = { args: { color: 'contrast' } };
const Blend: Story = { args: { color: 'plain' } };
const Danger: Story = { args: { color: 'danger' } };
const Icon: Story = { args: { color: 'primary', text: undefined, icon: CrossSVG } };
const IconAndText: Story = { args: { color: 'primary', icon: CrossSVG } };

const Children: Story = {
  args: {
    color: 'primary',
    text: undefined,
    children: (
      <>
        <CrossSVG />
        Hello!
        <CrossSVG />
      </>
    ),
  },
};

export default meta;
export { Default, Border, Grey, Transparent, Contrast, Blend, Danger, Icon, IconAndText, Children };
