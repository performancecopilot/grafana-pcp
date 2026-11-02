import { css } from '@emotion/css';
import React, { useCallback } from 'react';
import { AppPluginMeta, PluginConfigPageProps } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { Button, Icon, Stack, useTheme2 } from '@grafana/ui';
import { AppSettings } from './types';
import { RedisMigration } from './RedisMigration';

interface Props extends PluginConfigPageProps<AppPluginMeta<AppSettings>> {}

export const AppConfig = ({ plugin }: Props) => {
    const theme = useTheme2();
    const isEnabled = plugin.meta.enabled;

    const updatePluginSettings = useCallback(
        (settings: { enabled: boolean; jsonData: any; pinned: boolean }) => {
            return getBackendSrv().post(`/api/plugins/${plugin.meta.id}/settings`, settings);
        },
        [plugin.meta.id]
    );

    const onEnable = useCallback(async () => {
        await updatePluginSettings({ enabled: true, jsonData: {}, pinned: true });
        window.location.reload();
    }, [updatePluginSettings]);

    const onDisable = useCallback(async () => {
        await updatePluginSettings({ enabled: false, jsonData: {}, pinned: false });
        window.location.reload();
    }, [updatePluginSettings]);

    return (
        <div
            className={css`
                max-width: 900px;
                p {
                    margin-bottom: ${theme.spacing(2)};
                }
            `}
        >
            <h2>Performance Co-Pilot App</h2>
            <p>This app integrates metrics from Performance Co-Pilot.</p>
            <p>It includes the following data sources:</p>
            <ul
                className={css`
                    margin-left: ${theme.spacing(3)};
                    margin-bottom: ${theme.spacing(3)};
                    li + li {
                        margin-top: ${theme.spacing(1)};
                    }
                `}
            >
                <li>
                    <strong>PCP Valkey</strong> for fast, scalable time series aggregation across multiple hosts
                </li>
                <li>
                    <strong>PCP Vector</strong> for live, on-host metrics analysis, with container support
                </li>
                <li>
                    <strong>PCP bpftrace</strong> for system introspection using bpftrace scripts
                </li>
            </ul>
            {isEnabled && (
                <div
                    className={css`
                        margin-bottom: ${theme.spacing(2)};
                    `}
                >
                    <Icon
                        name="check"
                        className={css`
                            color: ${theme.colors.success.main};
                        `}
                    />{' '}
                    Plugin enabled. Please configure the data sources now.
                </div>
            )}
            <Stack direction="row" gap={1}>
                {isEnabled ? (
                    <Button variant="destructive" onClick={onDisable}>
                        Disable
                    </Button>
                ) : (
                    <Button onClick={onEnable}>Enable</Button>
                )}
            </Stack>
            <div
                className={css`
                    margin-top: ${theme.spacing(2)};
                    padding-top: ${theme.spacing(1)};
                    border-top: 1px solid ${theme.colors.border.weak};
                `}
            >
                <RedisMigration />
            </div>
        </div>
    );
};
