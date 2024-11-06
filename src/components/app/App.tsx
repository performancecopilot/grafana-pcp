import React from 'react';
import { AppRootProps } from '@grafana/data';
import { css } from '@emotion/css';

export function App(props: AppRootProps) {
    return (
        <div style={{ paddingTop: '2em' }}>
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
        </div>
    );
}
