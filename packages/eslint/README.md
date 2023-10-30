# @marzee/eslint

> Ready-to-use ESLint configuration for Next.js/TypeScript projects

`@marzee/eslint` provides a set of opinionated ESLint configurations for Next.js/TypeScript projects.

## Usage

```js
/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    '@marzee/eslint/next',
  ],
};

export default config;

```

## Install

```sh
npm i -D @marzee/eslint
```

```sh
pnpm i -D @marzee/eslint
```

```sh
yarn add -D @marzee/eslint
```

## License

ISC
