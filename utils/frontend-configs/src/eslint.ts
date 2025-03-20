import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
// @ts-expect-error: WiP: https://github.com/import-js/eslint-plugin-import/issues/3123
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const eslintConfig = tseslint.config(
  { ignores: ['**/dist', '**/build'] },

  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      jsxA11y.flatConfigs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      eslintPluginPrettierRecommended,
    ],

    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,

      // https://typescript-eslint.io/getting-started/typed-linting
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    // TODO: simplify after updates?
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    settings: {
      react: { version: 'detect' },

      // while https://github.com/import-js/eslint-import-resolver-typescript/issues/94 is resolved in 4.x,
      // extended config specified in references is ignored:
      // https://github.com/import-js/eslint-import-resolver-typescript/issues/400
      // also, baseUrl is not available because of regression related to:
      // https://github.com/import-js/eslint-import-resolver-typescript/pull/368
      // https://github.com/oxc-project/oxc-resolver/issues/416
      // on top of this, everything is okay within the directory, but not in monorepo - issue is unknown
      'import/resolver': {
        typescript: { project: ['**/tsconfig.json', '**/tsconfig.app.json'] },
      },
    },

    rules: {
      // plugins
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // import sort
      'import/order': [
        1,
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],

      // dx
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],

      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',

      // react-hook-form onSubmit
      '@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: { attributes: false } }],

      // we're using typescript
      'react/prop-types': 'off',
    },
  },
);

export { eslintConfig };
