var pkg = require("../package.json");
var fs = require("fs");
var chalk = require("chalk");
var rm = require("rimraf").sync;
var browserify = require("browserify");

var PACKAGE_NAME = pkg.name;
var PACKAGE_VERSION = pkg.version;
var DIST_PATH = "./dist/" + PACKAGE_NAME + ".js";

console.log(
  chalk.yellow(
    "Beginning build process for " +
      PACKAGE_NAME +
      " version v" +
      PACKAGE_VERSION
  )
);

console.log(chalk.gray("Removing dist directory and recreating it"));

rm("./dist");

console.log(chalk.green("Finishing cleaning dist directory."));

console.log(chalk.gray("Creating new dist directory"));
fs.mkdirSync("./dist");
console.log(chalk.green("The dist directory was created"));

console.log(chalk.gray("Bunding files with browserify"));
var distStream = fs.createWriteStream(DIST_PATH);

distStream.on("error", function (err) {
  console.error(chalk.red("There was a problem in the dist stream"));
  console.error(err);
});

var b = browserify({
  standalone: "markdownit-link-attributes",
});

b.add("./index.js");
b.bundle().pipe(distStream);
console.log(chalk.green("Bundling is complete"));
