'use strict'

var chai = require('chai')
var sinon = require('sinon')
var expect = chai.expect
var MarkdownIt = require('markdown-it')
var linkAttributes = require('../')

chai.use(require('sinon-chai'))

describe('markdown-it-link-attributes', function () {
  beforeEach(function () {
    this.md = MarkdownIt()
  })

  it('adds attribues to link', function () {
    this.md.use(linkAttributes, {
      attrs: {
        target: '_blank'
      }
    })

    var result = this.md.render('[link](https://google.com)')

    expect(result).to.contain('<a href="https://google.com" target="_blank">link</a>')
  })

  it('can pass in multiple attributes', function () {
    this.md.use(linkAttributes, {
      attrs: {
        target: '_blank',
        rel: 'noopener',
        foo: 'bar'
      }
    })

    var result = this.md.render('[link](https://google.com)')

    expect(result).to.contain('<a href="https://google.com" target="_blank" rel="noopener" foo="bar">link</a>')
  })

  it('takes pattern option and only apply attrs if pattern matched', function () {
    this.md.use(linkAttributes, {
      pattern: /^https?:\/\//,
      attrs: {
        target: '_blank',
        rel: 'noopener'
      }
    })

    var result = this.md.render('[link](https://google.com)')
    expect(result).to.contain('<a href="https://google.com" target="_blank" rel="noopener">link</a>')

    result = this.md.render('[link](#anchor)')
    expect(result).to.contain('<a href="#anchor">link</a>')
  })

  it('takes function option and applies attrs if function matched', function () {
    this.md.use(linkAttributes, {
      function: (href, config) => { return href.includes('google.com') },
      attrs: {
        target: '_blank',
        rel: 'noopener'
      }
    })

    var result = this.md.render('[link](https://google.com)')
    expect(result).to.contain('<a href="https://google.com" target="_blank" rel="noopener">link</a>')

    result = this.md.render('[link](#anchor)')
    expect(result).to.contain('<a href="#anchor">link</a>')
  })

  it('only function is tested if function and pattern defined', function () {
    this.md.use(linkAttributes, {
      function: (href, config) => { return href.startsWith('https:') && config.random },
      random: true,
      pattern: /^http?:\/\//,
      attrs: {
        target: '_blank',
        rel: 'noopener'
      }
    })

    var result = this.md.render('[link](https://google.com)')
    expect(result).to.contain('<a href="https://google.com" target="_blank" rel="noopener">link</a>')

    result = this.md.render('[link](http://google.com)')
    expect(result).to.contain('<a href="http://google.com">link</a>')
  })

  it('allows pattern passed to be a string representation of a RegExp', function () {
    this.md.use(linkAttributes, {
      pattern: '^https',
      attrs: {
        target: '_blank'
      }
    })

    var result = this.md.render('[link](https://google.com)')
    expect(result).to.contain('<a href="https://google.com" target="_blank">link</a>')

    result = this.md.render('[link](#anchor)')
    expect(result).to.contain('<a href="#anchor">link</a>')
  })

  it('allows multiple rules', function () {
    this.md.use(linkAttributes, [{
      pattern: /^https:/,
      attrs: {
        class: 'has-text-uppercase'
      }
    }, {
      pattern: /^#/,
      attrs: {
        class: 'is-blue'
      }
    }, {
      attrs: {
        class: 'is-red'
      }
    }])

    var result = this.md.render('[Google](https://www.google.com)')
    expect(result).to.contain('<a href="https://www.google.com" class="has-text-uppercase">Google</a>')

    result = this.md.render('[Go to top](#top)')
    expect(result).to.contain('<a href="#top" class="is-blue">Go to top</a>')

    result = this.md.render('[About](/page/about)')
    expect(result).to.contain('<a href="/page/about" class="is-red">About</a>')
  })

  it('treats className as if it is class', function () {
    this.md.use(linkAttributes, {
      attrs: {
        className: 'foo'
      }
    })

    var result = this.md.render('[Google](https://www.google.com)')

    expect(result).to.contain('class="foo"')
  })

  it('retains the original attr of a previous plugin that alters the attrs', function () {
    this.md.use(linkAttributes, {
      attrs: {
        keep: 'keep',
        overwrite: 'original'
      }
    })

    var original = this.md.render('[link](https://google.com)')

    expect(original).to.contain('<a href="https://google.com" keep="keep" overwrite="original">link</a>')

    this.md.use(linkAttributes, {
      attrs: {
        overwrite: 'new',
        newattr: 'new'
      }
    })

    var result = this.md.render('[link](https://google.com)')

    expect(result).to.contain('<a href="https://google.com" overwrite="original" newattr="new" keep="keep">link</a>')
  })

  it('works on plain urls when linkify is set to true', function () {
    var md = new MarkdownIt({
      linkify: true
    })
    md.use(linkAttributes, {
      attrs: {
        target: '_blank'
      }
    })

    var result = md.render('foo https://google.com bar')

    expect(result).to.contain('<a href="https://google.com" target="_blank">https://google.com</a>')
  })

  it('calls link_open function if provided', function () {
    var spy = this.md.renderer.rules.link_open = sinon.spy()
    this.md.use(linkAttributes)

    this.md.render('[link](https://google.com)')

    expect(spy).to.be.calledOnce // eslint-disable-line no-unused-expressions
  })

  it('calls default render if link_open rule is not defined', function () {
    var spy = sinon.spy(linkAttributes, 'defaultRender')
    this.md.use(linkAttributes)

    this.md.render('[link](https://google.com)')

    expect(spy).to.be.calledOnce // eslint-disable-line no-unused-expressions
  })
})
