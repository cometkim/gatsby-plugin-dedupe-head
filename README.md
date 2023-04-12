# gatsby-plugin-dedupe-head

[![Version on NPM](https://img.shields.io/npm/v/gatsby-plugin-dedupe-head)](https://www.npmjs.com/package/gatsby-plugin-dedupe-head)
[![MIT Licensed](https://img.shields.io/github/license/cometkim/gatsby-plugin-dedupe-head)](#license)

A GatsbyJS plugin to omit duplicated elements in the `<head>`.

This plugin **only affects the rendered HTML content**, enough for SEO purpose.

## List of properties to handle

Which tags will be de-duplicated:

- `title`
- `meta[name=description]`
- `link[rel=canonical]`
- `meta[property=og:title]`
- `meta[property=og:description]`
- `meta[name=twitter:*]`

This list cannot be customized yet. If you need other properties [please file an issue](https://github.com/cometkim/gatsby-plugin-dedupe-head/issues/new).

## Usage

```js
{
  plugins: [
    // Place this to last as possible.
    {
      resolve: 'gatsby-plugin-dedupe-head',
      options: {
        strategy: 'pick_first', // default
      },
    },
  ],
}
```

You can choose the dedupe strategy in `pick_first` or `pick_last`.

- `pick_first`: Keep the first matched tag. Omit others.
- `pick_last`: Keep the last matched tag. Omit others.

## LICENSE

MIT
