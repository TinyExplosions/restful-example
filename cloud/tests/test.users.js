var expect = require('chai').expect;
var users = require('./../users').routes();

describe('GET /Users', function () {
    it('should always return an array', function () {
        users._listAll()
        .then(function(models) {
            expect(models.length).to.equal(2);
        });
    });
});
