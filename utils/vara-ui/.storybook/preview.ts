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
    darkMode: {
      darkClass: 'dark-theme',
      stylePreview: true,
      current: 'light',
      light: {
        ...themes.light,
        appPreviewBg: '#ffffff',
      },
      dark: {
        ...themes.dark,
        appPreviewBg: '#1e1e20',
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
