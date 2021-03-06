'use strict';

var init = require('../../lib/cli/init');
var starterized = require('../../lib/starterized');

describe('$ starterized init <path>', function() {

  beforeEach(function() {
    spyOn(starterized, 'init');
  });

  it('should initialize a project in cwd', function() {
    init(['node', '/usr/local/bin/starterized', 'init']);
    expect(starterized.init).toHaveBeenCalledWith(process.cwd(), '', false);
  });

  it('should accept force flag', function() {
    init(['node', '/usr/local/bin/starterized', 'init', '--force']);
    expect(starterized.init).toHaveBeenCalledWith(process.cwd(), '', true);
  });

  it('should initialize a project in cwd at specified path', function() {
    init(['node', '/usr/local/bin/starterized', 'init', 'modul']);
    expect(starterized.init).toHaveBeenCalledWith(process.cwd(), 'modul', false);
  });

  it('should initialize a project at specified cwd and specified path', function() {
    init(['node', '/usr/local/bin/starterized', 'init', '--cwd', '~/Projects', 'demo']);
    expect(starterized.init).toHaveBeenCalledWith('~/Projects', 'demo', false);
  });

});
