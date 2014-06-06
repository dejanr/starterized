'use strict';

var eventBus = require('./util/event_bus');
var config = require('./config');

// **************
// Module Exports
// **************

module.exports = function(cwd) {
  eventBus.emit('verbose', 'Checking starterized config.');

  config.exists(cwd, function(err, exists) {
    if (!exists) {
      return eventBus.emit(
        'error', 'Starterized project not found.'
      );
    }

  });
};
