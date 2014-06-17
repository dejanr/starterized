'use strict';

var rewire = require('rewire');
var server = rewire('../../lib/starterized/server');
var eventBus = require('../../lib/starterized/util/event_bus');

describe('starterized server', function() {

  it('should exit with error when project doesn\'t exists', function() {
    var errorSpy = createSpy('errorSpy');

    server.__set__('parseConfig', createSpy().and.callFake(function() {
        return function(callback) {
          callback(new Error('Starterized project not found.'));
        };
      })
    );

    eventBus.removeAllListeners('error');
    eventBus.on('error', errorSpy);

    server('cwd');

    expect(errorSpy).toHaveBeenCalled();
  });

});
