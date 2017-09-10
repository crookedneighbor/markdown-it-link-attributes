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
```

```js
md.use(mila, {
  target: '_blank',
  rel: 'noopener'
})

var html = md.render('[link](https://google.com)')
html // <p><a href="https://google.com" target="_blank" rel="noopener">link</a></p>
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
