'use strict';

var rewire = require('rewire');
var init = rewire('../../lib/starterized/init');
var config = require('../../lib/starterized/config');
var eventBus = require('../../lib/starterized/util/event_bus');

describe('starterized init', function() {
  it('should exit with error when project already exists', function() {
    var errorSpy = createSpy('errorSpy');

    init.__set__('config', {
      exists: spyOn(config, 'exists').and.callFake(function(rootPath, callback) {
        callback(undefined, true);
      })
    });

    eventBus.removeAllListeners('error');
    eventBus.on('error', errorSpy);

    init('cwd', '', false);

    expect(errorSpy).toHaveBeenCalled();
  });

  it('should not exit with error when project exists and force is passed', function() {
    var errorSpy = createSpy('errorSpy');

    init.__set__('config', {
      exists: spyOn(config, 'exists').and.callFake(function(rootPath, callback) {
        callback(undefined, false);
      })
    });

    eventBus.removeAllListeners('error');
    eventBus.on('error', errorSpy);

    init('cwd', '', false);

    expect(errorSpy.calls.count()).toEqual(0);

  });
});
