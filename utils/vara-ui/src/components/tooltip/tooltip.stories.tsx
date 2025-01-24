import { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from './tooltip';
import { Button } from '../button';

type Type = typeof Tooltip;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Tooltip',
  component: Tooltip,
  args: {
    position: 'top',
    value: 'Tooltip',
    children: (
      <div style={{ maxWidth: '256px', margin: '64px auto 0' }}>
        <Button text="Hover me" block />
      </div>
    ),
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
