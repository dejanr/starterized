'use strict';

var path = require('path');

module.exports = {
  homePath: function() {
    return process.env[
      process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
    ];
  },
  getProjectPath: function(cwd, customPath) {
    return path.resolve(cwd, customPath);
  }
};
