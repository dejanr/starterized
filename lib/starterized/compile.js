'use strict';

var async = require('async');
var which = require('which');
var eventBus = require('./util/event_bus');
var config = require('./config');
var compass = require('./util/compass');

function parseConfig(cwd) {
  return function(callback) {
    config.exists(cwd, function(err, exists) {
      if (!exists) {
        return callback('Starterized project not found.');
      }

      config.parse(cwd, callback);
    });
  };
}

// **************
// Module Exports
// **************

module.exports = function(cwd) {
  eventBus.emit('verbose', 'Checking starterized project.');

  async.parallel({
    config: parseConfig(cwd),
    checkCompass: function(callback) {
      which('compass', callback);
    }
  }, function(err, results) {
    if (err) {
      return eventBus.emit('error', err);
    }

    compass.compile(cwd, results.config.publicDir, function() {
      if (err) {
        return eventBus.emit('error', err);
      }

      eventBus.emit('log', 'Starterized has been compiled.');
    });
  });
};
