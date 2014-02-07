'use strict';

var fs = require('fs');
var path = require('path');
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

/**
 * Read config from package.json
 *
 * @param Function callback
 */
Compile.prototype.readConfig = function(callback) {
  var packagePath = path.resolve(this.cwd, 'package.json');

  fs.readFile(packagePath, function(err, data) {
    var cfg = config.parseJSON(data);

    if (cfg) {
      callback(null, cfg.starterized);
    } else {
      callback(new Error('Error reading package.json config.'));
    }
  });
};

Compile.prototype.execute = function() {
  var options = [];
  var process;
  var cwd = this.cwd;

  this.readConfig(function(err, cfg) {
    if (err) {
      console.log(err);
      return false;
    }

    var publicPath = path.resolve(cwd, cfg.publicDir);

    fs.exists(publicPath, function(exists) {
      if (!exists) {
        console.error('Starterized publicDir folder doesnt exists.');
        return false;
      }

      options.push('compile');
      options.push(publicPath);

      process = spawn('compass', options);
      process.stdout.setEncoding('utf8');
      process.stdout.on('data', function(data) {
        console.log(data);
      });
      process.stderr.setEncoding('utf8');
      process.stderr.on('data', function(data) {
        console.log(data);
      });
    });
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
