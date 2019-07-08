import PCPContext from './PCPContext';

describe('PCPContext', () => {
  let ctx: PCPContext;

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
    ctx = new PCPContext("http://localhost:44323");
  });
  
  it('should get a context', (done) => {
    ctx.createContext().then(done);
  });

});
