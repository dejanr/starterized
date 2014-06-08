'use strict';

var bower = require('bower');
var eventBus = require('./event_bus');

module.exports.findDirectory = function(callback) {
  bower.commands.list({}, {offline: true})
  .on('error', function(err) {
    eventBus.emit('error', err);
  })
  .on('end', function (list) {
    var dirs = [];
    var dependencies = Object.keys(list && list.dependencies ? list.dependencies : {});

    dependencies.forEach(function(dependency) {
      var canonicalDir = list.dependencies[dependency].canonicalDir;
      dirs.push(canonicalDir.substr(0, canonicalDir.length - dependency.length));
    });

    var uniqDirs = dirs.filter(function(a, b, c){ return c.indexOf(a, b + 1) < 0; });

    callback(null, uniqDirs);
  });
};
