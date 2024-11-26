import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import '../src/assets/styles/index.css';

const preview: Preview = {
  parameters: {
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
    darkMode: {
      darkClass: 'dark-theme',
      stylePreview: true,
      dark: { ...themes.dark, appPreviewBg: 'black' },
    },
  },
  tags: ['autodocs'],
};

export default preview;
