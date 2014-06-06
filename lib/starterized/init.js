'use strict';

var async = require('async');
var fs = require('fs');
var path = require('path');
var eventBus = require('./util/event_bus');
var config = require('./config');
var mkdirp = require('mkdirp');
var ROOT_PATH = path.resolve(__dirname, '..', '..');
var SKELETON_PATH = path.resolve(ROOT_PATH, 'skeleton');

/**
 * Copy recursive all files and folders
 *
 * @param String dir
 * @param String dest
 * @param Function callback
 */
function copyRecursive(dir, dest, callback) {
  fs.readdir(dir, function(err, files) {
    async.each(files, function(file, callback) {
      var fromPath = path.resolve(dir, file);
      var toPath = path.resolve(dest, file);

      fs.stat(fromPath, function(err, stats) {
        if (stats.isDirectory()) {
          eventBus.emit('verbose', 'mkdir ' + toPath);
          mkdirp(toPath, function() {
            copyRecursive(fromPath, toPath, callback);
          });
        } else if (stats.isFile() && path.basename(toPath) !== '.gitkeep') {

          var from = fs.createReadStream(fromPath);
          var to = fs.createWriteStream(toPath);

          eventBus.emit('verbose', 'cp ' + toPath);

          from.on('error', function(err) {
            eventBus.emit('error', err);
          });
          to.on('error', function(err) {
            eventBus.emit('error', err);
          });
          to.on('close', function() {
            callback();
          });

          from.pipe(to);
        }
      });
    }, function() {
      callback();
    });
  });
}

/**
 * Write starterized config JSON inside package.json
 * or create package.json with starterized config when doesnt exists.
 *
 * @param String dir
 * @param String dest
 * @param Function callback
 */
function writeConfig(cwd, cfg, callback) {
  var packagePath = path.resolve(cwd, 'package.json');

  fs.readFile(packagePath, function(err, data) {
    var pkg;

    // when there is no package.json write only starterized config in it
    if (err) {
      return fs.writeFile(packagePath, JSON.stringify({starterized: cfg}, null, 2), callback);
    }

    try {
      pkg = JSON.parse(data);
    } catch (e) {
      return eventBus.emit('error', 'Error parsing package.json.');
    }

    if (pkg) {
      pkg.starterized = cfg;

      fs.writeFile(packagePath, JSON.stringify(pkg, null, 2), callback);
    } else {
      callback(new Error('Error parsing package.json.'));
    }
  });
}


// ********************************
// Command Steps executed in series
// ********************************

/**
 * Create root directory for project
 *
 * @param String cwd
 */
function createRootDirStep(cwd) {
  return function(callback) {
    eventBus.emit('verbose', 'Creating root directory.');
    mkdirp(cwd, callback);
  };
}

/**
 * Find preffered public directory
 *
 * @param String cwd
 * @param String publicDir
 */
function findPrefferedPublicDirStep(cwd, publicDir) {
  return function(callback) {
    if (publicDir) {
      return callback();
    }

    eventBus.emit('verbose', 'Finding preffered public dir.');

    async.filter([
      'web',
      'public'
    ], function(item, callback) {
      fs.readdir(path.resolve(cwd, item), function(err) {
        return err ? callback() : callback(item);
      });
    }, function(results) {
      if (results && results.length > 0) {
        publicDir = results.shift() || '';
      }

      return callback();
    });
  };
}

/**
 * Create public directory
 *
 * @param String cwd
 * @param String publicDir
 */
function createPublicDirStep(cwd, publicDir) {
  return function(callback) {
    mkdirp(path.resolve(cwd, publicDir), callback);
  };
}

/**
 * Copy project skeleton recursively
 *
 * @param String cwd
 * @param String publicDir
 */
function copySkeletonStep(cwd, publicDir) {
  return function(callback) {
    eventBus.emit('verbose', 'Copying project skeleton.');
    copyRecursive(SKELETON_PATH, path.resolve(cwd, publicDir), callback);
  };
}

/**
 * Write config file
 *
 * @param String cwd
 * @param String publicDir
 */
function writeConfigStep(cwd, publicDir) {
  return function(callback) {
    var cfg = {};

    if (publicDir) {
      cfg.publicDir = publicDir;
    }

    eventBus.emit('verbose', 'Writing starterized config.');
    writeConfig(cwd, cfg, callback);
  };
}

// **************
// Module Exports
// **************

module.exports = function(cwd, publicDir, force) {
  eventBus.emit('verbose', 'Checking starterized config.');

  config.exists(cwd, function(err, exists) {
    if (exists && !force) {
      return eventBus.emit(
        'error', 'Starterized already initialized:\n' +
        '  - Use -f option to override existing project.'
      );
    }

    async.series([
      createRootDirStep(cwd),
      findPrefferedPublicDirStep(cwd, publicDir),
      createPublicDirStep(cwd, publicDir),
      copySkeletonStep(cwd, publicDir),
      writeConfigStep(cwd, publicDir)
    ], function(err) {
      if (err) {
        return eventBus.emit('error', err);
      }

      eventBus.emit('log', 'Starterized has been initialized.');
    });
  });
};
