'use strict';

module.exports = {
  homePath: function() {
    return process.env[
      process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
    ];
  }
};
