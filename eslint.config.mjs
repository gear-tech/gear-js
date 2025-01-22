import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import storybook from 'eslint-plugin-storybook';
import reacthooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import reactrefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import json from '@eslint/json';

const IGNORES = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/lib/**'];

export default [
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
    files: ['apis/**/*.{ts,js}', 'idea/**/*.{ts,js}'],
    ignores: ['apis/gear/src/types/lookup.ts', 'idea/gear/frontend/**', ...IGNORES],
  })),
  {
    files: ['apis/**/*.{ts,js}', 'idea/**/*.{ts,js}'],
    ignores: ['apis/gear/src/types/lookup.ts', 'idea/gear/frontend/**', ...IGNORES],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-rest-params': 'off',
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
    },
  },
  ...[reactrefresh.configs.recommended, ...tseslint.configs.recommended].map((conf) => ({
    ...conf,
    files: ['utils/**/src/**/*.{ts,js,tsx,jsx}'],
  })),
  {
    files: ['utils/**/src/**/*.{ts,js,tsx,jsx}'],
    plugins: {
      storybook,
      'react-hooks': reacthooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
    },
  },
  ...[
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat['jsx-runtime'],
    jsxA11y.flatConfigs.recommended,
  ].map((conf) => ({ ...conf, files: ['idea/gear/frontend/src/**/*.{tx,js,tsx,jsx}'] })),
  {
    files: ['idea/gear/frontend/src/**/*.{tx,js,tsx,jsx}'],
    plugins: {
      'react-hooks': reacthooks,
    },
    languageOptions: {
      ecmaVersion: 'latest',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      'react/display-name': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
];
