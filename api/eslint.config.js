import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

export default {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: {
    '@typescript-eslint': typescriptEslint,
  },
  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    parser: tsParser,
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'always'],
    'object-curly-spacing': ['error', 'always'],
    indent: [
      'warn',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: false,
        offsetTernaryExpressions: true,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: [
      'warn',
      'single',
      {
        avoidEscape: true,
      },
    ],
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    'no-case-declarations': 0,
    'eol-last': 'error',
    'max-len': [
      'error',
      {
        code: 120,
        tabWidth: 2,
        ignoreStrings: true,
        ignoreComments: true,
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],
  },
};
