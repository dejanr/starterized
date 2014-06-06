'use strict';

var starterized = require('../starterized');
var Command = require('commander').Command;

module.exports = function(argv) {
  var command = new Command();
  var program = command
    .option('-d, --cwd [dir]', 'Change current working dir', process.cwd())
    .parse(argv);

  starterized.server(program.cwd);
};
