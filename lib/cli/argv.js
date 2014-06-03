'use strict';

var eventBus = require('../starterized/util/event_bus');
var commander = require('commander');

function logHandler(message) {
  console.log(message);
}

function verboseHandler(message) {
  console.log(message);
}

function warnHandler(message) {
  console.warn(message);
}

module.exports = function dispatch(argv) {
  var program = commander
    .option('-v, --verbose', 'Verbose output')
    .option('-s, --silent', 'Silent output')
    .parse(argv);

  var command = program.args.shift();

  if (!program.silent) {
    eventBus.on('log', logHandler);
  }

  if (!program.silent && program.verbose) {
    eventBus.on('verbose', verboseHandler);
    eventBus.on('warn', warnHandler);
  }

  process.on('uncaughtException', function (err) {
    console.log(err);
    process.exit(1);
  });

  if (command && command !== 'argv') {
    require('./' + command)(argv);
  } else if (!command) {
    require('./help')(argv);
  }
};
