export const metricMetadatas = jest.fn();
export const metricMetadata = jest.fn();
export const fetch = jest.fn();
export const store = jest.fn();
const mock = jest.fn().mockImplementation(() => {
    return { metricMetadatas, metricMetadata, fetch, store };
});

export default mock;
