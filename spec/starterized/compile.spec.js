'use strict';

var rewire = require('rewire');
var config = require('../../lib/starterized/config');
var compass = require('../../lib/starterized/util/compass');
var eventBus = require('../../lib/starterized/util/event_bus');
var path = require('path');

describe('starterized compile', function() {
  var compile;

  beforeEach(function() {
    compile = rewire('../../lib/starterized/compile');
  });

  it('should exit with error when project doesn\'t exists', function() {
    var errorSpy = createSpy('errorSpy');

    compile.__set__('config', {
      exists: spyOn(config, 'exists').and.callFake(function(rootPath, callback) {
        callback(undefined, false);
      })
    });

    eventBus.removeAllListeners('error');
    eventBus.on('error', errorSpy);

    compile('cwd');

    expect(errorSpy).toHaveBeenCalled();
  });

  it('should call compass compile  when config and compass exists', function() {
    var compassCompileSpy = createSpy(compass, 'compile');

    compile.__set__('which', createSpy('which').and.callFake(function(str, callback) {
      callback();
    }));

    compile.__set__('parseConfig', createSpy('parseConfig').and.callFake(function() {
      return function(callback) {
        callback(null, {publicDir: 'public'});
      };
    }));

    compile.__set__('compass', {
      compile: compassCompileSpy
    });

    compile(process.cwd());

    expect(compassCompileSpy.calls.count()).toEqual(1);
  });

});
