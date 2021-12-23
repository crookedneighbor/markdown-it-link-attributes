"use strict";

var MarkdownIt = require("markdown-it");
var linkAttributes = require("../");

describe("markdown-it-link-attributes", function () {
  var md;

  beforeEach(function () {
    md = MarkdownIt();
  });

  it("adds attribues to link", function () {
    md.use(linkAttributes, {
      attrs: {
        target: "_blank",
      },
    });

    var result = md.render("[link](https://google.com)");

    expect(result).toMatch(
      '<a href="https://google.com" target="_blank">link</a>'
    );
  });

  it("can pass in multiple attributes", function () {
    md.use(linkAttributes, {
      attrs: {
        target: "_blank",
        rel: "noopener",
        foo: "bar",
      },
    });

    var result = md.render("[link](https://google.com)");

    expect(result).toMatch(
      '<a href="https://google.com" target="_blank" rel="noopener" foo="bar">link</a>'
    );
  });

  it("takes matcher function if it returns true", function () {
    md.use(linkAttributes, {
      matcher: function (href) {
        return /^https?:\/\//.test(href);
      },
      attrs: {
        target: "_blank",
        rel: "noopener",
      },
    });

    var result = md.render("[link](https://google.com)");
    expect(result).toMatch(
      '<a href="https://google.com" target="_blank" rel="noopener">link</a>'
    );

    result = md.render("[link](#anchor)");
    expect(result).toMatch('<a href="#anchor">link</a>');
  });

  it("allows multiple rules", function () {
    md.use(linkAttributes, [
      {
        matcher: function (href) {
          return href.indexOf("https://") === 0;
        },
        attrs: {
          class: "has-text-uppercase",
        },
      },
      {
        matcher: function (href) {
          return href.indexOf("#") === 0;
        },
        attrs: {
          class: "is-blue",
        },
      },
      {
        attrs: {
          class: "is-red",
        },
      },
    ]);

    var result = md.render("[Google](https://www.google.com)");
    expect(result).toMatch(
      '<a href="https://www.google.com" class="has-text-uppercase">Google</a>'
    );

    result = md.render("[Go to top](#top)");
    expect(result).toMatch('<a href="#top" class="is-blue">Go to top</a>');

    result = md.render("[About](/page/about)");
    expect(result).toMatch('<a href="/page/about" class="is-red">About</a>');
  });

  it("uses the first rule that matches if multiple match", function () {
    md.use(linkAttributes, [
      {
        matcher: function (href) {
          return href.includes("g");
        },
        attrs: {
          class: "contains-g",
        },
      },
      {
        matcher: function (href) {
          return href.indexOf("https://") === 0;
        },
        attrs: {
          class: "starts-with-https",
        },
      },
      {
        matcher: function (href) {
          return href.indexOf("http") === 0;
        },
        attrs: {
          class: "starts-with-http",
        },
      },
    ]);

    var result = md.render("[Google](https://www.google.com)");
    expect(result).toMatch(
      '<a href="https://www.google.com" class="contains-g">Google</a>'
    );

    result = md.render("[Not Google](https://www.example.com)");
    expect(result).toMatch(
      '<a href="https://www.example.com" class="starts-with-https">Not Google</a>'
    );

    result = md.render("[Not Google and not secure](http://www.example.com)");
    expect(result).toMatch(
      '<a href="http://www.example.com" class="starts-with-http">Not Google and not secure</a>'
    );

    result = md.render("[Not Google and not secure](http://www.example.com/g)");
    expect(result).toMatch(
      '<a href="http://www.example.com/g" class="contains-g">Not Google and not secure</a>'
    );
  });

  // NEXT_MAJOR_VERSION we should probably apply all that apply instead of just going with the first to apply
  // The problem will be when multiple attrs are modifying the same property, in which case we'll probably just want to go with the first
  it("only uses the first rule if the first rule has no matcher", function () {
    md.use(linkAttributes, [
      {
        attrs: {
          class: "always-use-this",
        },
      },
      {
        matcher: function (href) {
          return href.includes("g");
        },
        attrs: {
          class: "contains-g",
        },
      },
      {
        matcher: function (href) {
          return href.indexOf("https://") === 0;
        },
        attrs: {
          class: "starts-with-https",
        },
      },
      {
        matcher: function (href) {
          return href.indexOf("http") === 0;
        },
        attrs: {
          class: "starts-with-http",
        },
      },
    ]);

    var result = md.render("[Google](https://www.google.com)");
    expect(result).toMatch(
      '<a href="https://www.google.com" class="always-use-this">Google</a>'
    );

    result = md.render("[Not Google](https://www.example.com)");
    expect(result).toMatch(
      '<a href="https://www.example.com" class="always-use-this">Not Google</a>'
    );

    result = md.render("[Not Google and not secure](http://www.example.com)");
    expect(result).toMatch(
      '<a href="http://www.example.com" class="always-use-this">Not Google and not secure</a>'
    );

    result = md.render("[Not Google and not secure](http://www.example.com/g)");
    expect(result).toMatch(
      '<a href="http://www.example.com/g" class="always-use-this">Not Google and not secure</a>'
    );
  });

  it("treats className as if it is class", function () {
    md.use(linkAttributes, {
      attrs: {
        className: "foo",
      },
    });

    var result = md.render("[Google](https://www.google.com)");

    expect(result).toMatch('class="foo"');
  });

  it("retains the original attr of a previous plugin that alters the attrs", function () {
    md.use(linkAttributes, {
      attrs: {
        keep: "keep",
        overwrite: "original",
      },
    });

    var original = md.render("[link](https://google.com)");

    expect(original).toMatch(
      '<a href="https://google.com" keep="keep" overwrite="original">link</a>'
    );

    md.use(linkAttributes, {
      attrs: {
        overwrite: "new",
        newattr: "new",
      },
    });

    var result = md.render("[link](https://google.com)");

    expect(result).toMatch(
      '<a href="https://google.com" overwrite="original" newattr="new" keep="keep">link</a>'
    );
  });

  it("works on plain urls when linkify is set to true", function () {
    var md = new MarkdownIt({
      linkify: true,
    });
    md.use(linkAttributes, {
      attrs: {
        target: "_blank",
      },
    });

    var result = md.render("foo https://google.com bar");

    expect(result).toMatch(
      '<a href="https://google.com" target="_blank">https://google.com</a>'
    );
  });

  it("calls link_open function if provided", function () {
    var spy = (md.renderer.rules.link_open = jest.fn());
    md.use(linkAttributes);

    md.render("[link](https://google.com)");

    expect(spy).toBeCalledTimes(1);
  });

  it("calls default render if link_open rule is not defined", function () {
    var spy = jest.spyOn(linkAttributes, "defaultRender");
    md.use(linkAttributes);

    md.render("[link](https://google.com)");

    expect(spy).toBeCalledTimes(1);
  });
});
