# markdown-it-link-attributes

> Link attributes plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

## Install

node.js, browser:

```bash
npm install markdown-it-link-attributes --save
bower install markdown-it-link-attributes --save
```

## Use

### Basic Configuration

You can pass an object with an attrs property. Each link parsed with this config will have the passed attributes.

```js
var md = require('markdown-it')()
var mila = require('markdown-it-link-attributes')

md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
})

var result = md.render('[Example](https://example.com')

result // <a href="https://example.com" target="_blank" rel="noopener">Example</a>
```

If the `linkify` option is set to `true` on `markdown-it`, then the attributes will be applied to plain links as well.

```js
var md = require('markdown-it')({
  linkify: true
})

md.use(mila, {
  target: '_blank',
  rel: 'noopener'
})

var html = md.render('foo https://google.com bar')
html // <p>foo <a href="https://google.com" target="_blank" rel="noopener">https://google.com</a> bar</p>
```

### Pattern

You can also specify a pattern property. The link's href property will be checked against the pattern RegExp provided and only apply the attributes if it matches the pattern.

```js
md.use(mila, {
  pattern: /^https:/,
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
})

var matchingResult = md.render('[Matching Example](https://example.com')
var ignoredResult = md.render('[Not Matching Example](http://example.com')

matchingResult // <a href="https://example.com" target="_blank" rel="noopener">Matching Example</a>
ignoredResult // <a href="http://example.com">Not Matching Example</a>
```

### Applying classes

You can either apply a `class` to a link by using a `class` or a `className` property. Either one will work, but use only one, not both.

```js
md.use(mila, {
  attrs: {
    class: 'my-class'
  }
})

// or
md.use(mila, {
  attrs: {
    className: 'my-class'
  }
})
```

### Multiple Configurations

Alternatively, you can pass an Array of configurations. The first pattern to match will be applied to the link.

```js
md.use(mila, [{
  pattern: /^https?:\/\//,
  attrs: {
    class: 'external-link'
  }
}, {
  pattern: /^\//,
  attrs: {
    class: 'absolute-link'
  }
}, {
  pattern: /blue/,
  attrs: {
    class: 'link-that-contains-the-word-blue'
  }
}])

var externalResult = md.render('[external](https://example.com')
var absoluteResult = md.render('[absolute](/some-page')
var blueResult = md.render('[blue](relative/link/with/blue/in/the/name')

externalResult // <a href="https://example.com" class="external-link">external</a>
absoluteResult // <a href="/some-page" class="absolute-link">absolute</a>
blueResult // <a href="relative/link/with/blue/in/the/name" class="link-that-contains-the-word-blue">blue</a>
```

If multiple patterns match, the first configuration to match will be used.

```
// This matches both the "starts with http or https" rule and the "contains the word blue" rule.
// Since the http/https rule was defined first, that is the configuration that is used.
var result = md.render('[external](https://example.com/blue')

result // <a href="https://example.com/blue" class="external-link">external</a>
```

## Usage in the browser

_Differences in browser._ If you load script directly into the page, without a package system, the module will add itself globally as `window.markdownitLinkAttributes`.
You need to load `dist/markdown-it-link-attributes.min.js`, if you don't use a build system. 

## Testing

This plugin is tested against markdown-it @ 9, 10 and latest

## License

[MIT](https://github.com/markdown-it/markdown-it-footnote/blob/master/LICENSE)
