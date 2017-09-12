# markdown-it-link-attributes

> Link attributes plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

## Install

node.js, browser:

```bash
npm install markdown-it-link-attributes --save
bower install markdown-it-link-attributes --save
```

## Use

```js
var md = require('markdown-it')()
var mila = require('markdown-it-link-attributes')

// Config
const options = {
  pattern: RegExp, // Default: undefined
  ignoreRelative: Boolean, // Default: false
  ...attrs // Attributes to assign to the link
}

md.use(mila, options)
// or
md.use(mila, [ ...options ])
```

```js
md.use(mila, {
  target: '_blank',
  rel: 'noopener',
  ignoreRelative: true // Prevent open relative links in a new window
})

var html = md.render('[link](https://google.com)')
html // <p><a href="https://google.com" target="_blank" rel="noopener">link</a></p>

html = md.render('[Go Top](#top)')
html // <p><a href="#top">link</a></p>
```

You can also assign different attributes to specified href by pattern.

```js
md.use(mila, [{
  pattern: /^\/about/,
  rel: 'author'
}, {
  ignoreRelative: true,
  target: '_blank',
  rel: 'noopener'
}, {
  'data-is-internal': true
}])

// The first one only catches hrefs which starts with `/about`
// The second one catches absolute links which uncatched from previous
// The last one catches all lefts links

md.render('[About me](/about/steve)')
// <p><a href="/about/steve" rel="author">About me</a></p>

md.render('[Can I Use ?](https://caniuse.com/)')
// <p><a href="https://caniuse.com/" target="_blank" rel="noopener">Can I Use ?</a></p>

md.render('[Reference](#reference)')
// <p><a href="#reference" data-is-internal="true">Reference</a></p>

md.render('[Submit](?page=docs)')
// <p><a href="?page=docs" data-is-internal="true">Submit</a></p>

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

_Differences in browser._ If you load script directly into the page, without a package system, the module will add itself globally as `window.markdownitLinkAttributes`.

## Testing

This plugin is tested against markdown-it @ 6,7,8 and latest

## License

[MIT](https://github.com/markdown-it/markdown-it-footnote/blob/master/LICENSE)
