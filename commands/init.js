'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var SKELETON_PATH = path.resolve(__dirname, '../skeleton');

/**
 * Initialize command used to scaffold a project
 */
var Init = function(dir) {
  this.dir = path.resolve(dir || './public');
};

/**
 * Create directory and intermediate directories as required.
 *
 * @param String path
 * @param Function callback
 */
Init.prototype.mkdir = function(path, callback) {
  return mkdirp(path, callback);
};

/**
 * Copy file or directory
 *
 * @param String fromPath
 * @param String toPath
 */
Init.prototype.copy = function(fromPath, toPath, callback) {
  var that = this;

  fs.stat(fromPath, function(err, stats) {
    if (stats.isDirectory()) {
      that.mkdir(toPath, function() {
        that.copyRecursive(fromPath, toPath, callback);
      });
    } else if (stats.isFile()) {
      var from = fs.createReadStream(fromPath);
      var to = fs.createWriteStream(toPath);

      from.on('error', function(err) {
        callback(err);
      });
      to.on('error', function(err) {
        callback(err);
      });
      to.on('close', function() {
        callback();
      });

      from.pipe(to);
    }
  });
};

/**
 * Traverse recursive trought all files in dir and call copy
 *
 * @param String dir
 * @param String dest
 * @param Function callback
 */
Init.prototype.copyRecursive = function(dir, dest, callback) {
  var that = this;

  dir = path.resolve(dir);
  dest = path.resolve(dest);

  fs.readdir(dir, function(err, files) {
    var subdir;

    dir = path.resolve(dir);
    subdir = dest.substr(that.dir.length);

    async.each(files, function(file, callback) {
      var fromPath = dir + '/' + file;
      var toPath = that.dir + subdir + '/' + file;

      that.copy(fromPath, toPath, callback);
    }, function(err) {
      if (err) {
        return callback(err);
      }

      callback(null, '=> finished copying project files');
    });
  });
};

/**
 * Execute Init Command
 *
 * @param Function callback
 */
Init.prototype.execute = function(callback) {
  var that = this;

  async.series([
    function mkdir(callback) {
      if (!fs.existsSync(that.dir)) {
        that.mkdir(that.dir, callback);
      } else {
        callback();
      }
    }, function copy(callback) {
      that.copyRecursive(SKELETON_PATH, that.dir, callback);
    }
  ], function(err) {
    if (err) {
      return callback(err);
    }

    callback(null, '=> starterized has been initialized');
  });
};

// **************
// Module Exports
// **************

/**
 * Export Init Command
 */
module.exports.Init = Init;

/**
 * Export action used by commander
 */
module.exports.action = function(dir) {
  var action = new Init(dir);

  action.execute(function(err, message) {
    if (err) {
      throw new Error('x>' + err);
    }

    console.log(message);
  });
};
