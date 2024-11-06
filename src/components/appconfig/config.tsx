import { css } from 'emotion';
import React, { PureComponent } from 'react';
import { AppPluginMeta, PluginConfigPageProps } from '@grafana/data';
import { BackendSrv, getBackendSrv } from '@grafana/runtime';
import { Button, Icon } from '@grafana/ui';
import { AppSettings } from './types';

interface Props extends PluginConfigPageProps<AppPluginMeta<AppSettings>> {}

export class AppConfig extends PureComponent<Props> {
    private backendSrv: BackendSrv;

    constructor(props: Props) {
        super(props);
        this.backendSrv = getBackendSrv();
        this.onEnable = this.onEnable.bind(this);
        this.onDisable = this.onDisable.bind(this);
    }

    async updatePluginSettings(settings: { enabled: boolean; jsonData: any; pinned: boolean }) {
        return this.backendSrv.post(`/api/plugins/${this.props.plugin.meta.id}/settings`, settings);
    }

    async onEnable() {
        await this.updatePluginSettings({ enabled: true, jsonData: {}, pinned: true });
        window.location.reload();
    }

    async onDisable() {
        await this.updatePluginSettings({ enabled: false, jsonData: {}, pinned: false });
        window.location.reload();
    }

    render() {
        const isEnabled = this.props.plugin.meta.enabled;
        return (
            <>
                <h2>Performance Co-Pilot App</h2>
                This app integrates metrics from Performance Co-Pilot.
                <br />
                <br />
                It includes the following data sources:
                <ul
                    className={css`
                        margin-left: 2em;
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
                            margin-top: 1.5em;
                        `}
                    >
                        <Icon
                            name="check"
                            className={css`
                                color: #10a345;
                            `}
                        />{' '}
                        Plugin enabled. Please configure the data sources now.
                    </div>
                )}
                <div className="gf-form gf-form-button-row">
                    {isEnabled ? (
                        <Button variant="destructive" onClick={this.onDisable}>
                            Disable
                        </Button>
                    ) : (
                        <Button onClick={this.onEnable}>Enable</Button>
                    )}
                </div>
            </>
        );
    }
}
