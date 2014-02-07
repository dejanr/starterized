'use strict';

var spawn = require('child_process').spawn;
var which = require('which');
var config = require('../library/config');

/**
 * Compile command used to compile compass project
 *
 * @param String publicDir  Project public dir for assets
 */
function Compile(cwd, options) {
  this.cwd = cwd;
  this.options = options;
}

Compile.prototype.execute = function() {
  var options = [];
  var process;

  options.push('compile');
  options.push('web');

  process = spawn('compass', options);

  process.stdout.setEncoding('utf8');
  process.stdout.on('data', function(data) {
    console.log(data);
  });
  process.stderr.setEncoding('utf8');
  process.stderr.on('data', function(data) {
    console.log(data);
  });
};

// **************
// Module Exports
// **************

/**
 * Export Compile Command
 */

exports.Compile = Compile;

/**
 *  Export action used by commander
 */
exports.action = function(cwd, options) {
  which('compass', function(err, path) {
    var compile;

    if (err || path === undefined) {
      console.log('Missing compass executable.');
      console.log('Please install compasss from http://compass-style.org');

      return false;
    }

    config.exists(cwd, function(err, exists) {
      if (!exists) {
        console.error('Starterized project not found.\n');
        return false;
      }

      compile = new Compile(cwd, options);
      compile.execute();
    });
  });
};
