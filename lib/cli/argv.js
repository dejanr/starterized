'use strict';

var pkg = require('../../package.json');
var eventBus = require('../starterized/util/event_bus');
var Command = require('commander').Command;

function logHandler(message) {
  console.log(message);
}

function verboseHandler(message) {
  console.log(message);
}

function warnHandler(message) {
  console.warn(message);
}

function errorHandler(message) {
  console.error(message);
  process.exit(1);
}

module.exports = function dispatch(argv) {
  var command = new Command();
  var program = command
    .version(pkg.version)
    .option('-v, --verbose', 'Verbose output')
    .option('-s, --silent', 'Silent output')
    .parse(argv);

  if (program.version) {
    console.log(program.version);
    process.exit(0);
  }

  var firstParam = program.args.shift();

  if (!program.silent) {
    eventBus.on('log', logHandler);
  }

  if (!program.silent && program.verbose) {
    eventBus.on('verbose', verboseHandler);
    eventBus.on('warn', warnHandler);
  }

  eventBus.on('error', errorHandler);

  process.on('uncaughtException', function (err) {
    console.log(err);
    process.exit(1);
  });

  if (firstParam && firstParam !== 'argv') {
    require('./' + firstParam)(argv);
  } else if (!firstParam) {
    require('./help')(argv);
  }
};
