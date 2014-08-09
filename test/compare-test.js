var esformatter = require('esformatter');
var semicolons = require('../');
var fs = require('fs');
var assert = require('assert');

describe('compare input/output', function() {
  before(function() {
    esformatter.register(semicolons);
  });

  describe('missing semicolons', function() {
    it('should be added to variable declarations', function() {
      check('variable-declaration');
    });

    it('should be added to return statements', function() {
      check('return-statement');
    });

    it('should be added to expression statements', function() {
      check('expression-statement');
    });
  });

  describe('unnecessary semicolons', function() {
    it('should be removed', function() {
      check('empty-statement');
    });
  });
});

function check(name) {
  var input = source('input/' + name + '.js');
  var output = source('output/' + name + '.js');

  assert.equal(esformatter.format(input), output);
}

function source(file) {
  return fs.readFileSync(__dirname + '/fixtures/' + file).toString();
}
