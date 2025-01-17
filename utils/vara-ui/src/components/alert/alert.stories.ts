import { Meta, StoryObj } from '@storybook/react';
import { Alert } from './alert';

type Type = typeof Alert;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Alert',
  component: Alert,
};

const Success: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, commodi dolore eaque eos est exercitationem inventore laboriosam modi perferendis voluptas!',
      options: { type: 'success', isClosed: true },
    },
  },
};

const Error: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, commodi dolore eaque eos est exercitationem inventore laboriosam modi perferendis voluptas!',
      options: { type: 'error', isClosed: true },
    },
  },
};

const Loading: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, commodi dolore eaque eos est exercitationem inventore laboriosam modi perferendis voluptas!',
      options: { type: 'loading', isClosed: true },
    },
  },
};

const Info: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, commodi dolore eaque eos est exercitationem inventore laboriosam modi perferendis voluptas!',
      options: { type: 'info', isClosed: true },
    },
  },
};

const WithFooter: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, commodi dolore eaque eos est exercitationem inventore laboriosam modi perferendis voluptas!',
      footer: 'YYYY-MM-DD / 00:00:00',
      options: { type: 'info', isClosed: true },
    },
  },
};

const NotificationError: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      options: { type: 'error', variant: 'notification', isClosed: true, title: 'Heading' },
    },
  },
};

const NotificationInfo: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      options: { type: 'info', variant: 'notification', isClosed: true, title: 'Heading' },
    },
  },
};

const NotificationSuccess: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      options: { type: 'success', variant: 'notification', isClosed: true, title: 'Heading' },
    },
  },
};

const NotificationLoading: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      options: { type: 'loading', variant: 'notification', isClosed: true, title: 'Heading' },
    },
  },
};

const NotificationWithFooter: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      footer: 'YYYY-MM-DD / 00:00:00',
      options: { type: 'info', variant: 'notification', isClosed: true, title: 'Heading' },
    },
  },
};

export default meta;
export {
  Success,
  Error,
  Loading,
  Info,
  WithFooter,
  NotificationSuccess,
  NotificationError,
  NotificationLoading,
  NotificationInfo,
  NotificationWithFooter,
};
