'use strict';

var starterized = require('../starterized');
var commander = require('commander');

module.exports = function(argv) {
  var program = commander.option('--cwd [dir]', 'Change current working dir', process.cwd()).parse(argv);
  var path = program.args.slice(1).shift();

  starterized.init(program.cwd, path || '');
};
