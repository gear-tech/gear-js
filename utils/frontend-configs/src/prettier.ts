import { type Config } from 'prettier';

const prettierConfig: Config = {
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
  printWidth: 120,
  semi: true,
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: 'always',
  tabWidth: 2,
};

export { prettierConfig };
