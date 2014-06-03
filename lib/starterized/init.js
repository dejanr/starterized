'use strict';

var eventBus = require('./util/event_bus');
var path = require('./util/path');

module.exports = function(cwd, customPath) {
  var projectPath = path.getProjectPath(cwd, customPath);

  eventBus.emit('log', 'Initializing new project');
};
