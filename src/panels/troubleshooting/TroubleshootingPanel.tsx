import { PanelProps } from '@grafana/data';
import * as grafanaUi from '@grafana/ui';
import React from 'react';
import { graphWrapper, notUsableContainer } from './styles';
import { TroubleshootingPane } from './TroubleshootingPane';
import { Options } from './types';
const { GraphNG, TooltipPlugin, ZoomPlugin } = grafanaUi;

interface Props extends PanelProps<Options> {}

export const TroubleshootingPanel: React.FC<Props> = (props: Props) => {
    const { data, timeRange, timeZone, width, height, options, onChangeTimeRange } = props;
    if (!options.troubleshooting) {
        return (
            <div className={notUsableContainer(width, height)}>
                <p>The PCP Troubleshooting panel is not intended for use in user defined dashboards.</p>
            </div>
        );
    }
    /**
     * For Grafana v8+, we need to use the <TimeSeries> component instead of the <GraphNG> component.
     * This component is not available in Grafana v7, and using package aliases to use both
     * @grafana/ui v7 and @grafana/ui v8 isn't successful because Grafana v8 requires Webpack v5.
     */
    if ((grafanaUi as any).TimeSeries) {
        return (
            <div className={notUsableContainer(width, height)}>
                <p>
                    The PCP Troubleshooting panel of grafana-pcp v3 is not compatible with Grafana v8.
                    <br />
                    Please import the regular dashboards (Dashboards tab in the PCP Vector data source settings),
                    <br />
                    downgrade to Grafana v7 or wait for the grafana-pcp v4 release.
                </p>
            </div>
        );
    }

    const dataAvailable = data?.series && data.series.length > 0;
    return (
        <div className={graphWrapper}>
            <TroubleshootingPane data={data} troubleshooting={options.troubleshooting}></TroubleshootingPane>
            {dataAvailable ? (
                <GraphNG
                    data={data.series}
                    timeRange={timeRange}
                    timeZone={timeZone}
                    width={width}
                    height={height}
                    legend={options.legend}
                >
                    <ZoomPlugin onZoom={onChangeTimeRange} />
                    <TooltipPlugin data={data.series} mode={options.tooltipOptions.mode} timeZone={timeZone} />
                </GraphNG>
            ) : (
                <div className="panel-empty">
                    <p>No data to display.</p>
                </div>
            )}
        </div>
    );
};
