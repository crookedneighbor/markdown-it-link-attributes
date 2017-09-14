'use strict'

var path = require('path')
var checkFile = require('check-ecmascript-version-compatibility')

describe('ECMAScript version', function () {
  it('markdown-it-link-attributes.js only uses ES5 for browser compatibility', function (done) {
    var jsPath = path.resolve(__dirname, '..', 'dist', 'markdown-it-link-attributes.js')

    this.slow(1000)
    this.timeout(2000)

    checkFile(jsPath, done)
  })
})
