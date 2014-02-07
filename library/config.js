'use strict';

var fs = require('fs');
var path = require('path');

exports.parseJSON = function(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return undefined;
  }
};

exports.exists = function(rootPath, callback) {
  exports.parse(rootPath, function(err, cfg) {
    if (err) {
      return callback(err, false);
    }
    callback(undefined, cfg ? true : false);
  });
};

exports.parse = function(rootPath, callback) {
  var packageJson = path.resolve(rootPath, 'package.json');

  fs.readFile(packageJson, {encoding: 'utf8', flag: 'r'}, function(err, data) {
    if (err) {
      return callback(err);
    }

    var cfg = exports.parseJSON(data) || {};

    callback(undefined, cfg.starterized);
  });
};
