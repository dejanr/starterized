'use strict';

var fs = require('fs');
var expect = require('expect.js');
var sinon = require('sinon');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var Initialize = require('../../commands/initialize').Initialize;

describe('commands/initialize', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('Initialize', function() {
    describe('#constructor', function() {
      it('should default root dir to current working dir', function() {
        var init = new Initialize(undefined, '.');

        expect(init.rootPath).to.be.equal(process.cwd());
      });
    });

    describe('#copy', function() {
      it('should copy file', function(done) {
        var init = new Initialize('/tmp/test', '.');

        mkdirp('/tmp/test', function() {
          init.copy(
            process.cwd() + '/skeleton/config.rb',
            '/tmp/test/config.rb',
            function() {
              fs.stat('/tmp/test/config.rb', function(err, stats) {
                expect(err).to.be.equal(null);
                expect(stats.isFile()).to.be.equal(true);
                rimraf('/tmp/test', done);
              });
            }
          );
        });
      });

      it('should create directory and copy recursive', function(done) {

        var init = new Initialize('/tmp/test-project', '.');
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
            }
          );
        });

      });
    });

    describe('#execute', function() {
      it('should create root, public dirs when doesnt exists', function(done) {
        var init = new Initialize('/tmp/some-dir', '.');
        var mkdir = sandbox.stub(init, 'mkdir',
          function(path, callback) {
            return callback();
          });

        sandbox.stub(init, 'copyRecursive', function(from, to, callback) {
          return callback();
        });

        init.execute(function() {
          expect(mkdir.calledTwice).to.be.equal(true);
          done();
        });
      });

      it('should skip creating public dir when exists', function(done) {
        var init = new Initialize('/tmp/some-dir', '.');
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
    });
  });
});
