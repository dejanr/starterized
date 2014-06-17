'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var spawn = require('child_process').spawn;
var which = require('which');
var express = require('express');
var swig = require('swig');
var server = express();
var eventBus = require('./util/event_bus');
var parseConfig = require('./util/parse_config');
var compass = require('./util/compass');
var watch = require('watch');

function walk(dir, cwd) {
  var results = [];

  fs.readdirSync(dir).forEach(function(file) {
      var filePath = path.join(dir, file);
      var stats = fs.statSync(filePath);
      if (stats && stats.isDirectory()) {
        results = results.concat(walk(filePath, cwd));
      } else {
        var subDir = dir.substr(cwd.length);
        results.push(path.join(subDir, file));
      }
    });

  return results;
}

module.exports = function(cwd, port) {
  async.parallel({
    config: parseConfig(cwd)
  }, function(err, results) {
    var markupPath = path.join(cwd, results.config.publicDir || '', '/markup');
    var compassPath = path.join(cwd, results.config.publicDir || '', '/compass');

    if (err) {
      return eventBus.emit('error', err);
    }

    process.chdir(cwd);

    eventBus.emit('log', 'Starting server on port ' + port);

    server.engine('html', swig.renderFile);
    server.set('view engine', 'html');
    server.set('views', markupPath);
    server.set('view cache', false);
    swig.setDefaults({ cache: false });

    server.use(function(req, res, next) {
      if (req.url === '/favicon.ico') {
        res.writeHead(200);
        return res.end();
      }

      next();
    });

    server.get('/', function(req, res) {
      res.render('index', {
        markupPath: markupPath,
        files: walk(markupPath, markupPath).filter(function(file) {
          return file !== 'index.html';
        })
      });
    });

    server.get('/index.html', function(req, res) {
      res.render('index');
    });

    server.get(/^\/(css|fonts|images|js)\/(.+)/, function(req, res) {
      var filePath = path.resolve(cwd, req.params[0], req.params[1]);

      fs.stat(filePath, function(err, stats) {
        if (err || stats.isDirectory()) {
          return res.send(404, 'File not found');
        }

        fs.createReadStream(filePath).pipe(res);
      });
    });

    server.get('*', function(req, res) {
      var ext = path.extname(req.url);
      var template = req.url.substr(0, req.url.length - ext.length);

      res.render(template.substr(1));
    });

    server.listen(port);

    which('open', function(err, path) {
      spawn(path, ['http://localhost:' + port]);
    });

    var filter = function(file) {
      // ignore css files
      return !file.match(path.join(cwd, results.config.publicDir || '', 'css'));
    };

    watch.createMonitor(cwd, {ignoreDotFiles: true, filter: filter}, function(monitor) {
      var executing = false;
      var executeCompile = function(file) {
        if (executing) {
          return false;
        }
        executing = true;

        if (file.match(compassPath)) {
          compass.compile(cwd, results.config.publicDir || '', function() {
            executing = false;
          });
        } else {
          executing = false;
        }
      };

      monitor.on('created', function(file) {
        eventBus.emit('log', '[created] ' + file);
        executeCompile(file);
      });
      monitor.on('changed', function(file) {
        eventBus.emit('log', '[changed] ' + file);
        executeCompile(file);
      });
      monitor.on('removed', function(file) {
        eventBus.emit('log', '[removed] ' + file);
        executeCompile(file);
      });
    });
  });
};
