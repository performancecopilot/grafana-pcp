import Context from '../context';

describe('Context', () => {
    let ctx: Context;

    beforeAll(() => {
        Context.datasourceRequest = (options: any) => {
            // todo: mock
        }
    });

    beforeEach(() => {
    });

    it('should get a context', async () => {
        //ctx = new Context("http://localhost:44323");
        //await ctx.createContext();
    });

});
