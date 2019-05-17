import utils from "../utils";
import Q from "q";

describe('utils', function() {
    describe('sharedPrefixLength', function() {
        it('returns 2 with two elements', function(done) {
            var input = [ 'abc', 'abd' ]

            var length = utils.sharedPrefixLength(input)
            expect(length).to.equal(2)
            done()
        })
    })
})
