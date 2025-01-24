import { Meta, StoryObj } from '@storybook/react';

import { ScrollArea } from './scroll-area';

type Type = typeof ScrollArea;
type Story = StoryObj<Type>;

const LONG_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc ultricies ultricies. Nullam nec purus nec nunc. Loremipsumdolorsitamet.';

const meta: Meta<Type> = {
  title: 'ScrollArea',
  component: () => <ScrollArea style={{ maxWidth: '512px', maxHeight: '128px' }}>{LONG_TEXT}</ScrollArea>,
  args: {},
};

const Default: Story = {
  args: {},
};

export default meta;
export { Default };
