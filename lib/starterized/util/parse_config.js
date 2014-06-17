'use strict';

var config = require('../config');

module.exports = function parseConfig(cwd) {
  return function(callback) {
    config.exists(cwd, function(err, exists) {
      if (!exists) {
        return callback('Starterized project not found.');
      }

      config.parse(cwd, callback);
    });
  };
};
