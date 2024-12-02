import { Meta, StoryObj } from '@storybook/react';
import { Modal } from './modal';

type Type = typeof Modal;
type Story = StoryObj<Type>;

const LONG_TEXT =
  'Text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text';

const meta: Meta<Type> = {
  title: 'Modal',
  component: Modal,
};

const Default: Story = {
  args: {
    heading: 'Heading',
    children: 'Some modal text',
    close: () => {},
  },
};

const Scroll: Story = {
  args: {
    heading: 'Heading',
    children: LONG_TEXT,
    footer: 'Footer',
  },
};

const Mobile: Story = {
  args: {
    heading: 'Mobile Modal',
    children: 'Some modal text',
    close: () => {},
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

const MobileScroll: Story = {
  args: {
    heading: 'Mobile Modal',
    children: LONG_TEXT,
    close: () => {},
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

export default meta;
export { Default, Scroll, Mobile, MobileScroll };
