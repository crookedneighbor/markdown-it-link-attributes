(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.markdownitLinkAttributes = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

// Adapted from https://github.com/markdown-it/markdown-it/blob/fbc6b0fed563ba7c00557ab638fd19752f8e759d/docs/architecture.md

function markdownitLinkAttributes (md, config) {
  config = config || {}

  var defaultRender = md.renderer.rules.link_open || this.defaultRender
  var attributes = Object.keys(config)

  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    attributes.forEach(function (attr) {
      var value = config[attr]
      var aIndex = tokens[idx].attrIndex(attr)

      if (aIndex < 0) { // attr doesn't exist, add new attribute
        tokens[idx].attrPush([attr, value])
      } else { // attr already exists, overwrite it
        tokens[idx].attrs[aIndex][1] = value // replace value of existing attr
      }
    })

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self)
  }
}

markdownitLinkAttributes.defaultRender = function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

module.exports = markdownitLinkAttributes

},{}]},{},[1])(1)
});