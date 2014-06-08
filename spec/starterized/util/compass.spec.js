'use strict';

var rewire = require('rewire');
var path = require('path');

describe('compass', function() {
  var compass;
  var spawnSpy;

  beforeEach(function() {
    compass = rewire('../../../lib/starterized/util/compass');

    spawnSpy = createSpy('spawn').and.returnValue({
      stdout: {
        setEncoding: createSpy(),
        on: createSpy()
      },
      stderr: {
        setEncoding: createSpy(),
        on: createSpy()
      }
    });

    compass.__set__('spawn', spawnSpy);
    compass.__set__('bower', {
      findDirectory: function(callback) {
        callback(null, [
          '/some/dir/'
        ]);
      }
    });
  });

  describe('compile', function() {

    it('should spawn compass compile command with resolved public path', function() {
      compass.compile(process.cwd(), 'public');

      expect(spawnSpy.calls.argsFor(0)[1][1]).toEqual(path.resolve(process.cwd(), 'public'));
    });

    it('should add includes for node_modules', function() {
      compass.compile(process.cwd(), 'public');

      expect(spawnSpy.calls.argsFor(0)[1][5]).toEqual(path.resolve(process.cwd(), 'node_modules'));
    });

    it('should add includes for bower components', function() {
      compass.compile(process.cwd(), 'public');

      expect(spawnSpy.calls.argsFor(0)[1][3]).toEqual('/some/dir/');
    });
  });

  describe('watch', function() {

    it('should spawn compass watch command with resolved public path', function() {
      compass.watch(process.cwd(), 'public');

      expect(spawnSpy.calls.argsFor(0)[1][1]).toEqual(path.resolve(process.cwd(), 'public'));
    });

    it('should add includes for node_modules', function() {
      compass.compile(process.cwd(), 'public');

      expect(spawnSpy.calls.argsFor(0)[1][5]).toEqual(path.resolve(process.cwd(), 'node_modules'));
    });

    it('should add includes for bower components', function() {
      compass.compile(process.cwd(), 'public');

      expect(spawnSpy.calls.argsFor(0)[1][3]).toEqual('/some/dir/');
    });
  });
});
