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
    this.md.use(linkAttributes, { target: '_blank' })

    var result = this.md.render('[link](https://google.com)')

    expect(result).to.contain('<a href="https://google.com" target="_blank">link</a>')
  })

  it('can pass in multiple attributes', function () {
    this.md.use(linkAttributes, {
      target: '_blank',
      rel: 'noopener',
      foo: 'bar'
    })

    var result = this.md.render('[link](https://google.com)')

    expect(result).to.contain('<a href="https://google.com" target="_blank" rel="noopener" foo="bar">link</a>')
  })

  it('allows different rules on specific href', function () {
    this.md.use(linkAttributes, [{
      pattern: /\bgoogle.com\b/, // External href in http(s) protocol
      target: '_blank',
      rel: 'noopener'
    }, {
      ignoreRelative: true, // Catch other absolute hrefs
      rel: 'noreferrer'
    }])

    // Rules to specific website
    var result = this.md.render('[link](https://google.com)')
    expect(result).to.contain('<a href="https://google.com" target="_blank" rel="noopener">link</a>')

    // Other website
    result = this.md.render('[link](https://github.com/crookedneighbor/markdown-it-link-attributes)')
    expect(result).to.contain('<a href="https://github.com/crookedneighbor/markdown-it-link-attributes" rel="noreferrer">link</a>')

    // Relative page
    result = this.md.render('[link](/page/relative-to-website)')
    expect(result).to.contain('<a href="/page/relative-to-website">link</a>')

    // Anchors should work, too
    result = this.md.render('[link](#anchor_link)')
    expect(result).to.contain('<a href="#anchor_link">link</a>')
  })

  it('retains the original attr of a previous plugin that alters the attrs', function () {
    this.md.use(linkAttributes, {
      keep: 'keep',
      overwrite: 'original'
    })

    var original = this.md.render('[link](https://google.com)')

    expect(original).to.contain('<a href="https://google.com" keep="keep" overwrite="original">link</a>')

    this.md.use(linkAttributes, {
      overwrite: 'new',
      newattr: 'new'
    })

    var result = this.md.render('[link](https://google.com)')

    expect(result).to.contain('<a href="https://google.com" overwrite="original" newattr="new" keep="keep">link</a>')
  })

  it('works on plain urls when linkify is set to true', function () {
    var md = new MarkdownIt({
      linkify: true
    })
    md.use(linkAttributes, { target: '_blank' })

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
