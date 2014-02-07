'use strict';

var sinon = require('sinon');
var expect = require('expect.js');
var config = require('../../library/config');
var path = require('path');

describe('config', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('exists', function() {
    it('should be true when configuration found', function(done) {
      var rootPath = path.resolve('test', 'fixtures', 'initialized-project');

      config.exists(rootPath, function(err, exists) {
        expect(exists).to.be.equal(true);
        done();
      });
    });
    it('should return err when package.json not found', function(done) {
      var rootPath = path.resolve('test', 'fixtures', 'empty-project');

      config.exists(rootPath, function(err) {
        expect(err).to.be.ok();
        done();
      });
    });
  });

  describe('parse', function() {
    it('should return undefined when no package.json', function(done) {
      var rootPath = path.resolve('test', 'fixtures', 'empty-project');

      config.parse(rootPath, function(err, cfg) {
        expect(cfg).to.be.equal(undefined);
        done();
      });
    });
  });
});
