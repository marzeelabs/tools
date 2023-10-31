# @marzee/eslint

> Ready-to-use ESLint configuration for Next.js/TypeScript projects

`@marzee/eslint` provides a set of opinionated ESLint configurations for Next.js/TypeScript projects.

## Usage

### Non-Monorepo

```js
/** @type {import("eslint").Linter.Config} */
const config = {
  extends: '@marzee/eslint-config/nextjs',
  // ⚠️ Careful: it's next*js* not *next*
};

module.exports = config;
```

### Monorepo

```js
/** @type {import("eslint").Linter.Config} */
const config = {
  extends: '@marzee/eslint-config/nextjs',
  settings: {
    next: {
      // Next-ESLint can't properly detect the root directory in a monorepo
      rootDir: 'packages/app' 
    }
  }
};

module.exports = config;
```

### ⚠️ Pay attention

It's  `nextjs` **NOT** `next`

## Install

```sh
npm i -D @marzee/eslint-config
```

```sh
pnpm i -D @marzee/eslint-config
```

```sh
yarn add -D @marzee/eslint-config
```

## License

ISC
