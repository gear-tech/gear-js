import { Meta, StoryObj } from '@storybook/react';

import { ScrollArea } from './scroll-area';

type Type = typeof ScrollArea;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'ScrollArea',
  component: ScrollArea,
  args: {},
};

const Default: Story = {
  args: {},
};

export default meta;
export { Default };
