import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import storybook from 'eslint-plugin-storybook';
import reacthooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import reactrefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import json from '@eslint/json';
import { eslintConfig as frontendEslintConfig } from '@gear-js/frontend-configs';

const noUnusedVars = [
  'error',
  {
    args: 'all',
    argsIgnorePattern: '^_',
    varsIgnorePattern: '^_',
    caughtErrorsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    ignoreRestSiblings: true,
  },
];

export default [
  { ignores: ['**/dist', '**/dist-temp'] },
  {
    ...json.configs.recommended,
    files: ['**/*.json'],
    language: 'json/jsonc',
    rules: {
      'json/no-duplicate-keys': 'error',
    },
  },
  ...[eslint.configs.recommended, ...tseslint.configs.recommended].map((conf) => ({
    ...conf,
    files: ['apis/**/{src,test}/**/*.{ts,js}', 'idea/**/src/**/*.{ts,js}', 'tools/**/src/**/*.{ts,js}'],
    ignores: ['apis/gear/src/types/lookup.ts', 'idea/gear/frontend/**', 'idea/gearexe/frontend/**'],
  })),
  {
    files: ['apis/**/{src,test}/**/*.{ts,js}', 'idea/**/src/**/*.{ts,js}', 'tools/**/src/**/*.{ts,js}'],
    ignores: ['apis/gear/src/types/lookup.ts', 'idea/gear/frontend/**', 'idea/gearexe/frontend/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': noUnusedVars,
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-rest-params': 'off',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
    },
  },
  ...frontendEslintConfig.map((conf) => ({
    ...conf,
    files: [
      'idea/gear/frontend/src/**/*.{ts,js,tsx,jsx}',
      'idea/gearexe/frontend/src/**/*.{ts,js,tsx,jsx}',
      'utils/gear-hooks/src/**/*.{ts,js,tsx,jsx}',
      'utils/gear-ui/src/**/*.{ts,js,tsx,jsx}',
      'utils/vara-ui/src/**/*.{ts,js,tsx,jsx}',
      'utils/wallet-connect/src/**/*.{ts,js,tsx,jsx}',
    ],
  })),
  ...storybook.configs['flat/recommended'].map((conf) => ({
    ...conf,
    files: ['utils/vara-ui/src/**/*.stories.{ts,js,tsx,jsx}'],
  })),
];
