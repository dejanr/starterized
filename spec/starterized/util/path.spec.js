'use strict';

var rewire = require('rewire');
var path = rewire('../../../lib/starterized/util/path');

describe('starterized util path', function() {

  describe('#findPreferredPublicDir', function() {

    it('should return dot, meaning current dir, when noone found', function() {
      path.__set__('fs', {
        exists: createSpy('exists').and.callFake(function(path, callback) {
          callback(false);
        })
      });

      path.findPreferredPublicDir('/some/path', function(publicDir) {
        expect(publicDir).toEqual('.');
      });
    });

    it('should return first match, when found', function() {
      path.__set__('fs', {
        exists: createSpy('exists').and.callFake(function(path, callback) {
          callback(true);
        })
      });

      path.findPreferredPublicDir('/some/path', function(publicDir) {
        expect(publicDir).toEqual('web');
      });
    });

  });

});
