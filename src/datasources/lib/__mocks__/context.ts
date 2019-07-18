export const fetchMetricMetadata = jest.fn();
export const findMetricMetadata = jest.fn();
export const fetch = jest.fn();
export const store = jest.fn();
const mock = jest.fn().mockImplementation(() => {
    return { fetchMetricMetadata, findMetricMetadata, fetch, store };
});

export default mock;
