'use strict';

var cli = require('../../lib/cli');
var starterized = require('../../lib/starterized');

describe('$ starterized init <path>', function() {

  beforeEach(function() {
    spyOn(starterized, 'init');
  });

  it('should initialize a project in cwd', function() {
    cli.argv(['node', '/usr/local/bin/starterized', 'init']);
    expect(starterized.init).toHaveBeenCalledWith(process.cwd(), '');
  });

  it('should initialize a project in cwd at specified path', function() {
    cli.argv(['node', '/usr/local/bin/starterized', 'init', 'modul']);
    expect(starterized.init).toHaveBeenCalledWith(process.cwd(), 'modul');
  });

  it('should initialize a project at specified cwd and specified path', function() {
    cli.argv(['node', '/usr/local/bin/starterized', 'init', '--cwd', '~/Projects', 'demo']);
    expect(starterized.init).toHaveBeenCalledWith('~/Projects', 'demo');
  });

});
