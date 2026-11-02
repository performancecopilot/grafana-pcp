import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RedisMigration } from './RedisMigration';

const backend = { get: jest.fn(), put: jest.fn() };
const datasourceSrv = { reload: jest.fn() };
const permission = jest.fn();

jest.mock('@grafana/runtime', () => ({
    getBackendSrv: () => backend,
    getDataSourceSrv: () => datasourceSrv,
    hasPermission: (action: string) => permission(action),
}));

const redis = {
    id: 1,
    uid: 'existing-uid',
    name: 'Historical metrics',
    type: 'performancecopilot-redis-datasource',
    readOnly: false,
};
const settings = {
    ...redis,
    url: 'http://pmproxy:44322',
    access: 'proxy',
    isDefault: true,
    basicAuth: true,
    basicAuthUser: 'existing-user',
    jsonData: { timeout: 42 },
    secureJsonFields: { basicAuthPassword: true },
    version: 7,
};
const button = () => screen.getByRole('button', { name: 'Migrate PCP Redis data sources' });

beforeEach(() => {
    jest.resetAllMocks();
    permission.mockReturnValue(true);
    backend.put.mockResolvedValue({});
    datasourceSrv.reload.mockResolvedValue(undefined);
});

test('fetches the full configuration and changes only type, preserving the UID and saved credential markers', async () => {
    backend.get.mockResolvedValueOnce([redis, { ...redis, uid: 'vector', type: 'performancecopilot-vector-datasource' }]);
    backend.get.mockResolvedValueOnce(settings);
    render(<RedisMigration />);
    fireEvent.click(button());
    await screen.findByText('Historical metrics: migrated to PCP Valkey.');
    expect(backend.get.mock.calls).toEqual([['/api/datasources'], ['/api/datasources/uid/existing-uid']]);
    expect(backend.put).toHaveBeenCalledTimes(1);
    expect(backend.put).toHaveBeenCalledWith('/api/datasources/uid/existing-uid', {
        ...settings,
        type: 'performancecopilot-valkey-datasource',
    });
    expect(settings.type).toBe('performancecopilot-redis-datasource');
    expect(datasourceSrv.reload).toHaveBeenCalledTimes(1);
});

test('waits for the session refresh before reporting a successful migration', async () => {
    let finishRefresh: () => void = () => {};
    datasourceSrv.reload.mockReturnValueOnce(new Promise<void>((resolve) => { finishRefresh = resolve; }));
    backend.get.mockResolvedValueOnce([redis]).mockResolvedValueOnce(settings);
    render(<RedisMigration />);
    fireEvent.click(button());
    await waitFor(() => expect(datasourceSrv.reload).toHaveBeenCalledTimes(1));
    expect(backend.put).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Historical metrics: migrated to PCP Valkey.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Migrating PCP Redis/ })).toBeDisabled();
    finishRefresh();
    await screen.findByText('Historical metrics: migrated to PCP Valkey.');
});

test('requires a page reload when the migration succeeds but the session refresh fails', async () => {
    backend.get.mockResolvedValueOnce([redis]).mockResolvedValueOnce(settings);
    datasourceSrv.reload.mockRejectedValueOnce(new Error('Refresh failed'));
    render(<RedisMigration />);
    fireEvent.click(button());
    await screen.findByText(
        'Historical metrics: migrated to PCP Valkey. Reload Grafana before checking dashboards and alert rules.'
    );
    expect(screen.queryByText(/Historical metrics: migration failed/)).not.toBeInTheDocument();
    expect(backend.put).toHaveBeenCalledTimes(1);
});

test('skips read-only provisioned data sources and explains the YAML change', async () => {
    backend.get.mockResolvedValueOnce([redis]).mockResolvedValueOnce({ ...settings, readOnly: true });
    render(<RedisMigration />);
    fireEvent.click(button());
    await screen.findByText(/Historical metrics: provisioned; update type to performancecopilot-valkey-datasource/);
    expect(backend.put).not.toHaveBeenCalled();
    expect(datasourceSrv.reload).not.toHaveBeenCalled();
});

test('does not overwrite a data source whose type changed after listing', async () => {
    backend.get.mockResolvedValueOnce([redis]).mockResolvedValueOnce({ ...settings, type: 'prometheus' });
    render(<RedisMigration />);
    fireEvent.click(button());
    await screen.findByText('Historical metrics: skipped because its type has already changed.');
    expect(backend.put).not.toHaveBeenCalled();
});

test('reports a failure, continues with other data sources, and supports retrying', async () => {
    const second = { ...settings, uid: 'second', name: 'Other metrics' };
    backend.get.mockResolvedValueOnce([redis, second]).mockResolvedValueOnce(settings).mockResolvedValueOnce(second);
    backend.put.mockRejectedValueOnce(new Error('Permission denied'));
    render(<RedisMigration />);
    fireEvent.click(button());
    await screen.findByText('Historical metrics: migration failed. Check your permissions and try again.');
    await screen.findByText('Other metrics: migrated to PCP Valkey.');
    backend.get.mockResolvedValueOnce([redis]).mockResolvedValueOnce(settings);
    fireEvent.click(button());
    await screen.findByText('Historical metrics: migrated to PCP Valkey.');
    expect(screen.queryByText(/Historical metrics: migration failed/)).not.toBeInTheDocument();
});

test('reports when there are no Redis data sources without updating anything', async () => {
    backend.get.mockResolvedValue([]);
    render(<RedisMigration />);
    fireEvent.click(button());
    await screen.findByText('No PCP Redis data sources found in this organization.');
    expect(backend.put).not.toHaveBeenCalled();
});

test('disables migration while listing data sources and permits retry after a listing error', async () => {
    let reject: (error: Error) => void = () => {};
    backend.get.mockReturnValueOnce(new Promise((resolve, rejectPromise) => { reject = rejectPromise; }));
    render(<RedisMigration />);
    fireEvent.click(button());
    expect(screen.getByRole('button', { name: /Migrating PCP Redis/ })).toBeDisabled();
    reject(new Error('Listing failed'));
    await screen.findByText('Could not list data sources');
    await waitFor(() => expect(button()).toBeEnabled());
    backend.get.mockResolvedValueOnce([]);
    fireEvent.click(button());
    await screen.findByText('No PCP Redis data sources found in this organization.');
    expect(screen.queryByText('Could not list data sources')).not.toBeInTheDocument();
});

test.each(['datasources:read', 'datasources:write'])('requires %s permission', (missing) => {
    permission.mockImplementation((action) => action !== missing);
    render(<RedisMigration />);
    expect(button()).toBeDisabled();
    fireEvent.click(button());
    expect(backend.get).not.toHaveBeenCalled();
});
