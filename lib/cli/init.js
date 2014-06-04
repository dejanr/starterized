'use strict';

var starterized = require('../starterized');
var Command = require('commander').Command;

module.exports = function(argv) {
  var command = new Command();
  var program = command
    .option('-d, --cwd [dir]', 'Change current working dir', process.cwd())
    .option('-f, --force', 'Use force to override existing project', false)
    .parse(argv);

  var publicPath = program.args.slice(1).shift();

  starterized.init(program.cwd, publicPath || '', program.force || false);
};
