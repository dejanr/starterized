'use strict';

var starterized = require('../../lib/starterized');
var server = require('../../lib/cli/server');

describe('$ starterized server', function() {

  beforeEach(function() {
    spyOn(starterized, 'server');
  });

  it('should start server for a project in cwd', function() {
    server(['node', '/usr/local/bin/starterized', 'server']);
    expect(starterized.server).toHaveBeenCalledWith(process.cwd(), 9000);
  });

  it('should start server for a project in specified cwd', function() {
    server(['node', '/usr/local/bin/starterized', 'server', '--cwd', '~/Projects']);
    expect(starterized.server).toHaveBeenCalledWith('~/Projects', 9000);
  });

});
