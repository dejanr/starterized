'use strict';

var compile = require('../../lib/cli/compile');
var starterized = require('../../lib/starterized');

describe('$ starterized init <path>', function() {

  beforeEach(function() {
    spyOn(starterized, 'compile');
  });

  it('should compile a project in cwd', function() {
    compile(['node', '/usr/local/bin/starterized', 'compile']);
    expect(starterized.compile).toHaveBeenCalledWith(process.cwd());
  });

  it('should compile a project in other directory specified but --cwd', function() {
    compile(['node', '/usr/local/bin/starterized', 'compile', '--cwd', '~/Projects/demo']);
    expect(starterized.compile).toHaveBeenCalledWith('~/Projects/demo');
  });
});
