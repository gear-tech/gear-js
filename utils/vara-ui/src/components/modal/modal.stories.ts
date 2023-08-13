import { Meta, StoryObj } from '@storybook/react';
import { Modal } from './modal';

type Type = typeof Modal;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Modal',
  component: Modal,
};

const Default: Story = {
  args: { heading: 'Heading', children: 'Some modal text', close: () => {} },
};

export default meta;
export { Default };
