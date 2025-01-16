import { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from './tooltip';

type Type = typeof Tooltip;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Tooltip',
  component: Tooltip,
  args: {
    position: 'top',
    value: 'Tooltip',
    children: <button style={{ marginLeft: '256px', marginTop: '256px' }}>Hover my insanely long text</button>,
  },
  argTypes: {
    position: {
      options: [
        'top-start',
        'top',
        'top-end',
        'right-start',
        'right',
        'right-end',
        'bottom-start',
        'bottom',
        'bottom-end',
        'left-start',
        'left',
        'left-end',
      ],
    },
  },
};

const Default: Story = {
  args: {},
};

export default meta;
export { Default };
