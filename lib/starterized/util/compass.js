'use strict';

var path = require('path');
var spawn = require('child_process').spawn;
var eventBus = require('./event_bus');
var bower = require('./bower');

module.exports.compile = function(cwd, publicDir) {
  var process;
  var options = [];

  options.push('compile');
  options.push(path.resolve(cwd, publicDir || ''));

  bower.findDirectory(function(err, dirs) {

    dirs.forEach(function(dir) {
      options.push('-I');
      options.push(dir);
    });

    if (fs.existsSync(path.resolve(cwd, 'node_modules'))) {
      options.push('-I');
      options.push(path.resolve(cwd, 'node_modules'));
    }

    eventBus.emit('verbose', 'Starting: compass ' + options.join(' '));

    process = spawn('compass', options);
    process.stdout.setEncoding('utf8');
    process.stdout.on('data', function(data) {
      eventBus.emit('log', data);
    });
    process.stderr.setEncoding('utf8');
    process.stderr.on('data', function(data) {
      eventBus.emit('error', data);
    });
  });
};

module.exports.watch = function(cwd, publicDir) {
  var process;
  var options = [];

  options.push('watch');
  options.push(path.resolve(cwd, publicDir || ''));

  bower.findDirectory(function(err, dirs) {

    dirs.forEach(function(dir) {
      options.push('-I');
      options.push(dir);
    });

    options.push('-I');
    options.push(path.resolve(cwd, 'node_modules'));

    process = spawn('compass', options);
    process.stdout.setEncoding('utf8');
    process.stdout.on('data', function(data) {
      eventBus.emit('log', data);
    });
    process.stderr.setEncoding('utf8');
    process.stderr.on('data', function(data) {
      eventBus.emit('error', data);
    });
  });
};
