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
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
      options: { type: 'success', isClosed: true },
    },
  },
};

const Error: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
      options: { type: 'error', isClosed: true },
    },
  },
};

const Loading: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
      options: { type: 'loading', isClosed: true },
    },
  },
};

const Info: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
      options: { type: 'info', isClosed: true },
    },
  },
};

const WithFooter: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
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

export default meta;
export { Success, Error, Loading, Info, WithFooter, NotificationError, NotificationInfo };
