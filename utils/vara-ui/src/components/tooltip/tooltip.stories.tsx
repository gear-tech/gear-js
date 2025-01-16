import { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from './tooltip';

type Type = typeof Tooltip;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Tooltip',
  component: Tooltip,
  args: {},
};

const Default: Story = {
  args: {},
};

export default meta;
export { Default };
