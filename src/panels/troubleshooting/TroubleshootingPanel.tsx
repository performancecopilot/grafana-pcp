import { PanelProps } from '@grafana/data';
import { GraphNG, TooltipPlugin, ZoomPlugin } from '@grafana/ui';
import React from 'react';
import { graphWrapper, notUsableContainer } from './styles';
import { TroubleshootingPane } from './TroubleshootingPane';
import { Options } from './types';

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
