'use strict';

var fs = require('fs');
var expect = require('expect.js');
var sinon = require('sinon');
var Init = require('../../commands/init').Init;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');

describe('Initialize Command', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('constructor', function() {
    it('should have default dir equal to public', function() {
      var init = new Init();

      expect(init.dir).to.be.equal(process.cwd() + '/public');
    });

    it('should resolve dir based on current directory', function() {
      var init = new Init('some-dir');
      var init2 = new Init('.');

      expect(init.dir).to.be.equal(process.cwd() + '/some-dir');
      expect(init2.dir).to.be.equal(process.cwd());
    });
  });

  describe('copy', function() {
    it('should copy file', function(done) {
      var init = new Init('/tmp/test');

      mkdirp('/tmp/test', function() {
        init.copy(process.cwd() + '/skeleton/config.rb', '/tmp/test/config.rb',
          function() {
            fs.stat('/tmp/test/config.rb', function(err, stats) {
              expect(err).to.be.equal(null);
              expect(stats.isFile()).to.be.equal(true);
              rimraf('/tmp/test', done);
            });
          });
      });
    });

    it('should create directory and copy recursive', function(done) {

      var init = new Init('/tmp/test-project');
      var copyRecursive = sandbox.stub(init, 'copyRecursive',
        function(from, to, callback) {
          return callback();
        });

      mkdirp('/tmp/test-project', function() {
        init.copy(
          process.cwd() + '/skeleton/js',
          '/tmp/test-project/js',
          function() {
            fs.stat('/tmp/test-project/js', function(err, stats) {
              expect(err).to.be.equal(null);
              expect(stats.isDirectory()).to.be.equal(true);
              expect(copyRecursive.calledOnce).to.be.equal(true);
              rimraf('/tmp/test-project', done);
            });
          });
      });

    });
  });

  describe('execute', function() {
    it('should create project dir when doesnt exists', function(done) {
      var init = new Init('some-dir');
      var mkdir = sandbox.stub(init, 'mkdir',
        function(path, callback) {
          return callback();
        });

      sandbox.stub(init, 'copyRecursive', function(from, to, callback) {
        return callback();
      });

      init.execute(function() {
        expect(mkdir.calledOnce).to.be.equal(true);
        done();
      });
    });

    it('should skip creating project dir when exists', function(done) {
      var init = new Init('/tmp/some-dir');
      var count = 0;

      sandbox.stub(init, 'mkdir',
        function(path, callback) {
          if (path === '/tmp/some-dir') {
            count = count + 1;
          }

          return callback();
        });

      mkdirp('/tmp/some-dir', function() {
        init.execute(function() {
          expect(count).to.be.equal(0);
          rimraf('/tmp/some-dir', done);
        });
      });
    });

    it('should copy all files recursive', function(done) {
      var init = new Init('/tmp/full-project-test');

      init.execute(function() {
        fs.readdir('/tmp/full-project-test', function(err, files) {
          fs.readdir(__dirname + '/../../skeleton', function(err, skel) {
            expect(files.length).to.be.equal(skel.length);
            rimraf('/tmp/full-project-test', done);
          });
        });
      });
    });
  });
});
