'use strict';

var cli = require('../../lib/cli');
var starterized = require('../../lib/starterized');

describe('$ starterized init <path>', function() {

  beforeEach(function() {
    spyOn(starterized, 'compile');
  });

  it('should compile a project in cwd', function() {
    cli.argv(['node', '/usr/local/bin/starterized', 'compile']);
    expect(starterized.compile).toHaveBeenCalledWith(process.cwd());
  });

  it('should compile a project in other directory specified but --cwd', function() {
    cli.argv(['node', '/usr/local/bin/starterized', 'compile', '--cwd', '~/Projects/demo']);
    expect(starterized.compile).toHaveBeenCalledWith('~/Projects/demo');
  });
});
