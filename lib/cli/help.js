'use strict';

var commander = require('commander');
var path = require('path');
var fs = require('fs');

module.exports = function showHelp(argv) {
  var program = commander.parse(argv);


  var basepath = path.join(__dirname, '..', '..', 'doc', 'cli');
  var filepath = program.args.slice(0);

  filepath = filepath.length > 0 ? filepath : ['help'];
  filepath.push('txt');
  filepath = filepath.join('.');
  filepath = path.join(basepath, filepath);

  fs.readFile(filepath, 'utf-8', function(err, data) {
    if (err) {
      console.log('Documentation not available for: ' + program.args.splice(1).join(' '));
    } else {
      console.log(data);
    }
  });
};
