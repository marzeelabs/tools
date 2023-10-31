/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked'
  ],
  parserOptions: {
    sourceType: 'module',
    project: true
  },
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['./**/*.{js,mjs,cjs}'],
    },
  ],
  rules: {
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array'
      }
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-import-type-side-effects': 'error'
  }
};
