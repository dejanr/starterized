'use strict';

var rewire = require('rewire');
var argv = rewire('../../lib/cli/argv');
var eventBus = require('../../lib/starterized/util/event_bus');
var starterized = require('../../lib/starterized');

describe('cli.argv', function() {

  beforeEach(function() {
    spyOn(starterized, 'init');
    argv.__set__('logHandler', createSpy('logHandler'));
    argv.__set__('verboseHandler', createSpy('verboseHandler'));
    argv.__set__('warnHandler', createSpy('warnHandler'));
  });

  it('should output log messages only', function() {
    argv(['node', '/usr/local/bin/starterized', 'init']);

    eventBus.emit('log', 'Some log message');
    eventBus.emit('verbose', 'Some verbose message');

    expect(argv.__get__('logHandler').calls.count()).toEqual(1);
    expect(argv.__get__('warnHandler').calls.count()).toEqual(0);
    expect(starterized.init).toHaveBeenCalled();
  });

  it('should output log, verbose, warn and error messages when verbose is set', function() {
    argv(['node', '/usr/local/bin/starterized', 'init', '--verbose']);

    eventBus.emit('log', 'Some log message');
    eventBus.emit('log', 'Some log message');
    eventBus.emit('verbose', 'Some verbose message');
    eventBus.emit('warn', 'Some warn message');

    expect(argv.__get__('logHandler').calls.count()).toEqual(2);
    expect(argv.__get__('verboseHandler').calls.count()).toEqual(1);
    expect(argv.__get__('warnHandler').calls.count()).toEqual(1);
    expect(starterized.init).toHaveBeenCalled();
  });

  it('should not output messages when silent is set', function() {
    argv(['node', '/usr/local/bin/starterized', 'init', '--silent']);

    eventBus.emit('log', 'Some log message');
    eventBus.emit('verbose', 'Some verbose message');
    eventBus.emit('warn', 'Some warn message');
    eventBus.emit('log', 'Some log message');

    expect(argv.__get__('logHandler').calls.count()).toEqual(0);
    expect(argv.__get__('verboseHandler').calls.count()).toEqual(0);
    expect(argv.__get__('warnHandler').calls.count()).toEqual(0);
    expect(starterized.init).toHaveBeenCalled();
  });

});
