'use strict'

// Adapted from https://github.com/markdown-it/markdown-it/blob/fbc6b0fed563ba7c00557ab638fd19752f8e759d/docs/architecture.md

var OPTION_KEYS = ['pattern']

function markdownitLinkAttributes (md, _config) {
  var configs = Array.isArray(_config) ? _config : [_config || {}]

  configs = configs.map(function (config) {
    var result = { attrs: {} }

    Object.keys(config).forEach(function (key) {
      if (OPTION_KEYS.indexOf(key) > -1) {
        result[key] = config[key]
      } else {
        result.attrs[key] = config[key]
      }
    })

    return result
  })

  Object.freeze(configs)

  var defaultRender = md.renderer.rules.link_open || this.defaultRender

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    var href = tokens[idx].attrGet('href')
    var config = null

    for (var i = 0; i < configs.length; ++i) {
      var conf = configs[i]
      if (!conf.pattern || (conf.pattern && conf.pattern.test(href))) {
        config = conf
        break
      }
    }

    if (config) {
      Object.keys(config.attrs).forEach(function (attr) {
        var value = config.attrs[attr]
        var aIndex = tokens[idx].attrIndex(attr)

        if (aIndex < 0) { // attr doesn't exist, add new attribute
          tokens[idx].attrPush([attr, value])
        } else { // attr already exists, overwrite it
          tokens[idx].attrs[aIndex][1] = value // replace value of existing attr
        }
      })
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }
}

markdownitLinkAttributes.defaultRender = function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

module.exports = markdownitLinkAttributes
