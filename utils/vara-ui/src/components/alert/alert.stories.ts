import { Meta, StoryObj } from '@storybook/react';
import { Alert } from './alert';

type Type = typeof Alert;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Alert',
  component: Alert,
};

export const Success: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
      options: { type: 'success', isClosed: true, footer: 'YYYY-MM-DD / 00:00:00' },
    },
  },
};

export const Error: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
      options: { type: 'error', isClosed: true },
    },
  },
};

export const Loading: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
      options: { type: 'loading', isClosed: true },
    },
  },
};

export const Info: Story = {
  args: {
    alert: {
      id: '0',
      content:
        'Backups of this machine are stopped. There has no connection with machine. Please restore the connection with the machine to resume backups restore the connection with the machine.',
      options: { type: 'info', isClosed: true },
    },
  },
};

export const NotificationHighPriority: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      options: { type: 'notification-high', isClosed: true, title: 'Heading' },
    },
  },
};

export const NotificationLowPriority: Story = {
  args: {
    alert: {
      id: '0',
      content: 'Text',
      options: { type: 'notification-low', isClosed: true, title: 'Heading' },
    },
  },
};

export default meta;
