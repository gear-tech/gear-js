import type { StorybookConfig } from '@storybook/react-vite';
import { dirname } from 'path';
import { fileURLToPath } from 'node:url';

/**
 * This function is used to resolve the absolute path of a package.
 * It is necessary in projects that use Yarn PnP or are set up within a monorepo.
 */
const getAbsolutePath = (packageName: string) =>
  dirname(fileURLToPath(import.meta.resolve(`${packageName}/package.json`)));

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-onboarding'),
    getAbsolutePath('@vueless/storybook-dark-mode'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
};

export default config;
