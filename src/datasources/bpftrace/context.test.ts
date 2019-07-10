import Context from './context';

describe('Context', () => {
  let ctx: Context;

  beforeEach(() => {
    let dummyrequest = (options) => {
      if (options.url.includes("/pmapi/context")) {
        return Promise.resolve({
          data: {
            "context": 2070898489
          }
        });
      }
      return Promise.resolve({});
    }
    ctx = new Context("http://localhost:44323");
  });
  
  it('should get a context', (done) => {
    ctx.createContext().then(done);
  });

});
