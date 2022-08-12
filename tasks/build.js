var pkg = require("../package.json");
var fs = require("fs");
var rm = require("rimraf").sync;
var browserify = require("browserify");

var PACKAGE_NAME = pkg.name;
var PACKAGE_VERSION = pkg.version;
var DIST_PATH = "./dist/" + PACKAGE_NAME + ".js";

function color(color, message) {
  const map = {
    gray: "\u001b[90m",
    green: "\u001b[32m",
    red: "\u001b[31m",
    yellow: "\u001b[33m",
  };
  const defaultColorCode = "\x1b[0m";
  const colorCode = map[color] || defaultColorCode;

  return `${colorCode}${message}${defaultColorCode}`;
}

console.log(
  color(
    "yellow",
    `Beginning build process for ${PACKAGE_NAME} version v${PACKAGE_VERSION}`
  )
);

console.log(color("gray", "Removing dist directory and recreating it"));

rm("./dist");

console.log(color("green", "Finishing cleaning dist directory."));

console.log(color("gray", "Creating new dist directory"));
fs.mkdirSync("./dist");
console.log(color("green", "The dist directory was created"));

console.log(color("gray", "Bunding files with browserify"));
var distStream = fs.createWriteStream(DIST_PATH);

distStream.on("error", function (err) {
  console.error(color("red", "There was a problem in the dist stream"));
  console.error(err);
});

var b = browserify({
  standalone: "markdownit-link-attributes",
});

b.add("./index.js");
b.bundle().pipe(distStream);
console.log(color("green", "Bundling is complete"));
