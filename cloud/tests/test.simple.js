var expect = require('chai').expect,
    main = require('./../main');

describe('Heartbeat', function () {
    it('should always return success', function () {
        main.heartbeat(null,function(err,res){
            expect(res.heartbeat).to.equal("success");
        });
    });
});
