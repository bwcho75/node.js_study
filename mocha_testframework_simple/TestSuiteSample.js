var assert = require('assert');

describe('BDD style',function(){
    before(function(){
        console.log("before test suite\n");
    });
    after(function(){
        console.log("after test suite\n");

    });
    beforeEach(function(){
        console.log("before test case\n");
    });
    afterEach(function(){
        console.log("after test case\n");

    });
    // test case
    describe('testsuite1',function(){
        it('test case #1',function(){

            assert.equal((4+5),9);
        });
        it('should return -1 when the value is not present');
        it.only('test case #2',function(){
            console.log("tc2");
            assert.equal((4+1),9);
        });
    });


});
