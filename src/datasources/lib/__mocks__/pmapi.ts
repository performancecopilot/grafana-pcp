export const ContextMock = {
    metricMetadatas: jest.fn(),
    metricMetadata: jest.fn(),
    fetch: jest.fn(),
    store: jest.fn()
};

export const Context = jest.fn().mockImplementation(() => {
    return ContextMock;
});
