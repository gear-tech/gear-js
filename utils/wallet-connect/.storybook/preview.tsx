import { AccountProvider, ApiProvider } from '@gear-js/react-hooks';
import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import '@gear-js/vara-ui/dist/style.css';

const apiArgs = { endpoint: process.env.STORYBOOK_NODE_ADDRESS };
const queryClient = new QueryClient();

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'default',
      values: [
        {
          name: 'default',
          value: '#f3f9f8',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ApiProvider initialArgs={apiArgs}>
        <AccountProvider appName="wallet-connect">
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </AccountProvider>
      </ApiProvider>
    ),
  ],
};

export default preview;
