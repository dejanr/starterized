'use strict';

var rewire = require('rewire');
var help = rewire('../../lib/cli/help.js');
var path = require('path');

describe('$ starterized help <command>', function() {

  beforeEach(function() {
    help.__set__("fs", {
      readFile: createSpy('readFile')
    });
  });

  it('should show usage doc for starterized when command is omitted', function() {
    var helpFile = path.resolve('doc', 'cli', 'help.txt');

    help(['node', '/usr/local/bin/starterized', 'help']);

    expect(help.__get__('fs').readFile).toHaveBeenCalled();
    expect(help.__get__('fs').readFile.calls.argsFor(0)[0]).toEqual(helpFile);
  });

  it('should show doc for a specified command', function() {
    var helpFile = path.resolve('doc', 'cli', 'help.init.txt');

    help(['node', '/usr/local/bin/starterized', 'help', 'init']);

    expect(help.__get__('fs').readFile).toHaveBeenCalled();
    expect(help.__get__('fs').readFile.calls.argsFor(0)[0]).toEqual(helpFile);
  });
});
