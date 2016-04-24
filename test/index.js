'use strict'

var chai = require('chai')
var sinon = require('sinon')
var expect = chai.expect
var MarkdownIt = require('markdown-it')
var linkTarget = require('../')

chai.use(require('sinon-chai'))

describe('markdown-it-linkify-images', function () {
  beforeEach(function () {
    this.md = new MarkdownIt()
  })

  it('changes link target to _blank', function () {
    this.md.use(linkTarget)

    var result = this.md.render('[link](https://google.com)')

    expect(result).to.contain('<a href="https://google.com" target="_blank">link</a>')
  })

  it('works on plain urls when linkify is set to true', function () {
    var md = new MarkdownIt({
      linkify: true
    })
    md.use(linkTarget)

    var result = md.render('foo https://google.com bar')

    expect(result).to.contain('<a href="https://google.com" target="_blank">https://google.com</a>')
  })

  it('allows target value to be configured', function () {
    this.md.use(linkTarget, {
      target: '_top'
    })

    var result = this.md.render('[link](https://google.com)')

    expect(result).to.contain('<a href="https://google.com" target="_top">link</a>')
  })

  it('calls link_open function if provided', function () {
    var spy = this.md.renderer.rules.link_open = sinon.spy()
    this.md.use(linkTarget)

    this.md.render('[link](https://google.com)')

    expect(spy).to.be.calledOnce
  })

  it('calls default render if link_open rule is not defined', function () {
    var spy = sinon.spy(linkTarget, 'defaultRender')
    this.md.use(linkTarget)

    this.md.render('[link](https://google.com)')

    expect(spy).to.be.calledOnce
  })
})
