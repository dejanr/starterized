'use strict';

var cli = require('../../lib/cli');
var starterized = require('../../lib/starterized');

describe('$ starterized server', function() {

  beforeEach(function() {
    spyOn(starterized, 'server');
  });

  it('should start server for a project in cwd', function() {
    cli.argv(['node', '/usr/local/bin/starterized', 'server']);
    expect(starterized.server).toHaveBeenCalledWith(process.cwd());
  });

  it('should start server for a project in specified cwd', function() {
    cli.argv(['node', '/usr/local/bin/starterized', 'server', '--cwd', '~/Projects']);
    expect(starterized.server).toHaveBeenCalledWith('~/Projects');
  });

});
