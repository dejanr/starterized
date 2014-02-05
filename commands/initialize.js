'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var config = require('../config');
var SKELETON_PATH = path.resolve(__dirname, '../skeleton');

/**
 * Initialize command used to scaffold a project
 *
 * @param String rootPath   Project root
 * @param String publicDir  Project public dir for assets
 * @param Object options    Optional options
 */
var Initialize = function(rootPath, publicDir, options) {
  this.rootPath = rootPath ? rootPath : path.resolve('.');
  this.publicPath = path.resolve(this.rootPath, publicDir);
  this.options = options;
};

/**
 * Create directory and intermediate directories as required.
 *
 * @param String path
 * @param Function callback
 */
Initialize.prototype.mkdir = function(path, callback) {
  return mkdirp(path, callback);
};

/**
 * Copy file or directory
 *
 * @param String fromPath
 * @param String toPath
 */
Initialize.prototype.copy = function(fromPath, toPath, callback) {
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
Initialize.prototype.copyRecursive = function(dir, dest, callback) {
  var that = this;

  dir = path.resolve(dir);
  dest = path.resolve(dest);

  fs.readdir(dir, function(err, files) {
    var subdir;

    dir = path.resolve(dir);
    subdir = dest.substr(that.publicPath.length);

    async.each(files, function(file, callback) {
      var fromPath = dir + '/' + file;
      var toPath = that.publicPath + subdir + '/' + file;

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
 * Execute Initialize Command
 *
 * @param Function callback
 */
Initialize.prototype.execute = function(callback) {
  var that = this;

  async.series([
    function createRootDir(callback) {
      if (!fs.existsSync(that.rootPath)) {
        that.mkdir(that.rootPath, callback);
      } else {
        callback();
      }
    }, function createPublicDir(callback) {
      if (!fs.existsSync(that.publicPath)) {
        that.mkdir(that.publicPath, callback);
      } else {
        callback();
      }
    }, function copySkeletonRecursive(callback) {
      that.copyRecursive(SKELETON_PATH, that.publicPath, callback);
    }
  ], function(err) {
    if (err && callback) {
      return callback(err);
    }

    if (callback) {
      callback(null, '=> Starterized has been initialized');
    }
  });
};

// **************
// Module Exports
// **************

/**
 * Export Initialize Command
 */
module.exports.Initialize = Initialize;

/**
 * Find prefered public path, defaults to .
 *
 * @param String rootPath
 * @param Function callback
 */
var findPublicDir = function(rootPath, callback) {
  async.filter([
    'web',
    'public'
  ], function(item, callback) {
    fs.exists(path.resolve(rootPath, item), callback);
  }, function(results) {
    if (results && results.length > 0) {
      return callback(results.pop());
    }

    callback('.');
  });
};

/**
 * Helper for starting Initialize
 *
 * @param String rootPath
 * @param String publicDir
 */
var initialize = function(rootPath, publicDir, options) {
  var initialize = new Initialize(rootPath, publicDir, options);

  console.log('Initializing new Starterized project.');

  initialize.execute();
};

/**
 * Export action used by commander
 */
module.exports.action = function(cwd, dir, options) {
  var rootPath = cwd || path.resolve('.');

  config.exists(rootPath, function(err, exists) {
    if (exists) {
      console.error('Starterized already initialized.\n');
      console.error('Use -f flag to override eixsting project.');
      return false;
    }

    if (dir) {
      initialize(rootPath, dir, options);
    } else {
      findPublicDir(rootPath, function(publicDir) {
        initialize(rootPath, publicDir, options);
      });
    }
  });
};
