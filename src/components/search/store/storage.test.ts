import { migrateSearchStorage, searchStorageKey } from './storage';

describe('search storage migration', () => {
    const oldKey = 'persist:grafana-pcp-app:search';
    const newKey = `persist:${searchStorageKey}`;
    const savedSearch = JSON.stringify({ bookmarks: '["bookmark"]', history: '["query"]' });

    beforeEach(() => window.localStorage.clear());
    afterEach(() => {
        jest.restoreAllMocks();
        window.localStorage.clear();
    });

    it('moves bookmarks and history without changing their persisted format', () => {
        window.localStorage.setItem(oldKey, savedSearch);
        migrateSearchStorage();
        expect(window.localStorage.getItem(newKey)).toBe(savedSearch);
        expect(window.localStorage.getItem(oldKey)).toBeNull();
        migrateSearchStorage();
        expect(window.localStorage.getItem(newKey)).toBe(savedSearch);
    });

    it('preserves existing data at the new key', () => {
        window.localStorage.setItem(oldKey, savedSearch);
        window.localStorage.setItem(newKey, 'existing');
        migrateSearchStorage();
        expect(window.localStorage.getItem(newKey)).toBe('existing');
        expect(window.localStorage.getItem(oldKey)).toBe(savedSearch);
    });

    it('does nothing when there is no old data', () => {
        migrateSearchStorage();
        expect(window.localStorage.getItem(newKey)).toBeNull();
    });

    it('keeps the old data if writing fails', () => {
        window.localStorage.setItem(oldKey, savedSearch);
        jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Storage full');
        });
        expect(() => migrateSearchStorage()).not.toThrow();
        expect(window.localStorage.getItem(oldKey)).toBe(savedSearch);
    });

    it('tolerates unavailable storage', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('Storage unavailable');
        });
        expect(() => migrateSearchStorage()).not.toThrow();
    });
});
