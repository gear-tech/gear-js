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

const NotificationWarning: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      options: { type: 'notification-warning', isClosed: true, title: 'Heading' },
    },
  },
};

const NotificationInfo: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      options: { type: 'notification-info', isClosed: true, title: 'Heading' },
    },
  },
};

export default meta;
export { Success, Error, Loading, Info, NotificationWarning, NotificationInfo };
