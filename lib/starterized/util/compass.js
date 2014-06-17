'use strict';

var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var eventBus = require('./event_bus');
var bower = require('./bower');

module.exports.compile = function(cwd, publicDir, callback) {
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
      console.log(data);
    });
    process.stderr.setEncoding('utf8');
    process.stderr.on('data', function(data) {
      console.log(data);
    });
    process.on('close', function(code) {
      if (code !== 0) {
        return callback(new Error('Error compiling compass'));
      }

      callback();
    });
  });
};
