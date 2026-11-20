export const searchStorageKey = 'performancecopilot-pcp-app:search';

// redux-persist adds "persist:" to the configured key by default.
export const migrateSearchStorage = () => {
    const oldKey = 'persist:grafana-pcp-app:search';
    const newKey = `persist:${searchStorageKey}`;
    try {
        const oldValue = window.localStorage.getItem(oldKey);
        if (oldValue !== null && window.localStorage.getItem(newKey) === null) {
            window.localStorage.setItem(newKey, oldValue);
            window.localStorage.removeItem(oldKey);
        }
    } catch {
        // Storage may be unavailable or full. Keep the old data if copying fails.
    }
};
