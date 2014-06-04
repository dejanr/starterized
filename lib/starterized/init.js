'use strict';

var eventBus = require('./util/event_bus');
var path = require('./util/path');
var config = require('./config');

module.exports = function(cwd, publicDir, force) {
  var publicPath = path.resolvePublicPath(cwd, publicDir);

  eventBus.emit('verbose', 'Checking starterized config.');
  config.exists(cwd, function(err, exists) {
    if (exists && !force) {
      eventBus.emit('error', 'Starterized already initialized:\n' +
                             '  - Use -f option to override existing project.');
    }

  });

};
