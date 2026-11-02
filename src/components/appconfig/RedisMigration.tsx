import { css } from '@emotion/css';
import React, { useState } from 'react';
import { DataSourceSettings } from '@grafana/data';
import { getBackendSrv, getDataSourceSrv, hasPermission } from '@grafana/runtime';
import { Alert, Button, FieldSet, useTheme2 } from '@grafana/ui';

const REDIS_TYPE = 'performancecopilot-redis-datasource';
const VALKEY_TYPE = 'performancecopilot-valkey-datasource';

export const RedisMigration = () => {
    const theme = useTheme2();
    const [running, setRunning] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [error, setError] = useState(false);
    const canMigrate = hasPermission('datasources:read') && hasPermission('datasources:write');

    const migrate = async () => {
        if (!canMigrate || running) {
            return;
        }
        setRunning(true);
        setResults([]);
        setError(false);
        const report = (message: string) => setResults((previous) => [...previous, message]);

        try {
            const backend = getBackendSrv();
            const datasources = await backend.get<DataSourceSettings[]>('/api/datasources');
            const redisDatasources = datasources.filter((datasource) => datasource.type === REDIS_TYPE);
            if (redisDatasources.length === 0) {
                report('No PCP Redis data sources found in this organization.');
            }
            for (const datasource of redisDatasources) {
                try {
                    // Fetch the full, current configuration rather than updating from the list response.
                    const url = `/api/datasources/uid/${encodeURIComponent(datasource.uid)}`;
                    const settings = await backend.get<DataSourceSettings>(url);
                    if (settings.type !== REDIS_TYPE) {
                        report(`${settings.name}: skipped because its type has already changed.`);
                    } else if (settings.readOnly) {
                        report(`${settings.name}: provisioned; update type to ${VALKEY_TYPE} in its provisioning YAML.`);
                    } else {
                        await backend.put(url, { ...settings, type: VALKEY_TYPE });
                        try {
                            await getDataSourceSrv().reload();
                            report(`${settings.name}: migrated to PCP Valkey.`);
                        } catch {
                            report(
                                `${settings.name}: migrated to PCP Valkey. Reload Grafana before checking dashboards and alert rules.`
                            );
                        }
                    }
                } catch {
                    report(`${datasource.name}: migration failed. Check your permissions and try again.`);
                }
            }
        } catch {
            setError(true);
        } finally {
            setRunning(false);
        }
    };

    return (
        <FieldSet label="Upgrade PCP Redis data sources">
            <p>
                Migrate PCP Redis data sources in this organization to PCP Valkey, keeping their UIDs, settings and saved
                credentials. Existing dashboards and alert rules retain their data source references.
            </p>
            <p>
                Read-only provisioned data sources are skipped. Update the provisioning YAML for all provisioned data
                sources, including editable ones, before restarting Grafana or reloading provisioning to prevent the Redis
                type from being restored.
            </p>
            {!canMigrate && <p>You need permission to read and update data sources to run this migration.</p>}
            <Button
                className={css`
                    margin-top: ${theme.spacing(1)};
                    margin-bottom: ${theme.spacing(2)};
                `}
                onClick={migrate}
                disabled={!canMigrate || running}
                icon={running ? 'fa fa-spinner' : undefined}
            >
                {running ? 'Migrating PCP Redis data sources…' : 'Migrate PCP Redis data sources'}
            </Button>
            {error && (
                <Alert severity="error" title="Could not list data sources">
                    Check your permissions and try again.
                </Alert>
            )}
            <div role="status" aria-live="polite">
                {results.length > 0 && (
                    <ul
                        className={css`
                            margin: 0;
                            padding-left: ${theme.spacing(3)};
                            li + li {
                                margin-top: ${theme.spacing(1)};
                            }
                        `}
                    >
                        {results.map((result, index) => (
                            <li key={index}>{result}</li>
                        ))}
                    </ul>
                )}
            </div>
        </FieldSet>
    );
};
