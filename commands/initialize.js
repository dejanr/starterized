'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var async = require('async');
var config = require('../library/config');
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
  this.publicDir = publicDir;
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

Initialize.prototype.writeConfig = function(cfg, callback) {
  var packagePath = path.resolve(this.rootPath, 'package.json');

  fs.readFile(packagePath, function(err, data) {
    var pkg = config.parseJSON(data);

    if (pkg) {
      pkg.starterized = cfg;

      fs.writeFile(packagePath, JSON.stringify(pkg, null, 2), callback);
    } else {
      callback(new Error('Error parsing package.json.'));
    }
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
    }, function writeConfig(callback) {
      that.writeConfig({
        publicDir: that.publicDir || '.'
      }, callback);
    }
  ], function(err) {
    if (err && callback) {
      return callback(err);
    }

    if (callback) {
      callback();
    }
  });
};

/**
 * Find preferred public path, defaults to
 * public or web folder, fallback to current
 * working directory.
 *
 * @param String rootPath
 * @param Function callback
 */
function findPreferredPublicDir(rootPath, callback) {
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
}

// **************
// Module Exports
// **************

/**
 * Export Initialize Command
 */
module.exports.Initialize = Initialize;

/**
 * Export action used by commander
 */
module.exports.action = function(cwd, dir, options) {
  var command;

  config.exists(cwd, function(err, exists) {
    if (exists && !options.force) {
      console.error('Starterized already initialized.\n');
      console.error('Use -f option to override existing project.');
      return false;
    }

    console.log('Initializing new Starterized project.');

    if (dir) {
      command = new Initialize(cwd, dir, options);
      command.execute();
    } else {
      findPreferredPublicDir(cwd, function(publicDir) {
        command = new Initialize(cwd, publicDir, options);
        command.execute();
      });
    }
  });
};
