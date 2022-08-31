module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: ["airbnb-base"],
  root: true,
  env: {
    es2021: true,
    node: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    "max-len": ["error", { "code": 120, "tabWidth": 2 }],
    "comma-dangle": ["error", "always-multiline"],
    "import/prefer-default-export": "off",
    "arrow-parens": [2, "as-needed", { "requireForBlockBody": true }],
    "no-useless-constructor": "off",
    "no-empty-function": ["error", { "allow": ["constructors"] }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "class-methods-use-this": "off",
    "import/extensions": ["error", "always", { "ts": "never", "js": "never" }],
    "no-shadow": "off",
    "no-await-in-loop": "off",
    "no-restricted-syntax": ["error", "WithStatement", "BinaryExpression[operator='in']"],
    "@typescript-eslint/no-shadow": ["error"],
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
    "arrow-body-style": ["error", "as-needed"],
    "implicit-arrow-linebreak": ["error", "beside"],
    "no-param-reassign": ["error", { "props": false }],
    "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
    "object-curly-newline": ["error", { "consistent": true }],
  },
  settings: {
    "import/resolver": {
      "node": { "extensions": [".ts"] }
    }
  }
};
