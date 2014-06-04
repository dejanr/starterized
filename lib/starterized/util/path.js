'use strict';

var path = require('path');
var async = require('async');
var fs = require('fs');

module.exports = {
  /**
   * Get OS specific home folder
   *
   * @return String
   */
  homePath: function() {
    return process.env[
      process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
    ];
  },

  /**
   * Find preferred public path, defaults to
   * public or web folder, fallback to current
   * working directory.
   *
   * @param String rootPath
   * @param Function callback
   */
  findPreferredPublicDir: function findPreferredPublicDir(rootPath, callback) {
    async.filter([
      'web',
      'public'
    ], function(item, callback) {
      fs.exists(path.resolve(rootPath, item), callback);
    }, function(results) {
      if (results && results.length > 0) {
        return callback(results.shift());
      }

      callback('.');
    });
  },

  /**
   * Resolve public inside cwd, and return absolute path
   *
   * @return String
   */
  resolvePublicPath: function(cwd, publicDir) {
    return path.resolve(cwd, publicDir);
  }
};
