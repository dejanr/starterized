'use strict';

var async = require('async');
var which = require('which');
var eventBus = require('./util/event_bus');
var parseConfig = require('./util/parse_config');
var compass = require('./util/compass');

// **************
// Module Exports
// **************

module.exports = function(cwd, callback) {
  eventBus.emit('verbose', 'Checking starterized project.');

  async.parallel({
    config: parseConfig(cwd),
    checkCompass: function(callback) {
      which('compass', callback);
    }
  }, function(err, results) {
    if (err) {
      eventBus.emit('error', err);
      return callback ? callback(err) : false;
    }

    compass.compile(cwd, results.config.publicDir, function() {
      if (err) {
        return eventBus.emit('error', err);
      }

      eventBus.emit('log', 'Starterized has been compiled.');
      return callback ? callback() : true;
    });
  });
};
