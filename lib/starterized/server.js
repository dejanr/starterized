'use strict';

var express = require('express');
var server = express();
var eventBus = require('./util/event_bus');

server.get('/', function(req, res) {
  res.end();
});

server.get('/:path', function(req, res) {
  res.end();
});

module.exports = function(cwd, port) {
  eventBus.emit('log', 'Starting server on port ' + port);
  process.chdir(cwd);
  server.listen(port);
};
