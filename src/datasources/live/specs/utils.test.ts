import * as utils from "../utils";

describe('utils', function() {
    describe('sharedPrefixLength', function() {
        it('returns 2 with two elements', function(done) {
            var input = [ 'abc', 'abd' ]

            var length = utils.sharedPrefixLength(input)
            expect(length).toEqual(2)
            done()
        })
    })
})
