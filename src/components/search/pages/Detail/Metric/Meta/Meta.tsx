import { Button } from '@grafana/ui';
import { css } from 'emotion';
import React from 'react';
import { MetricEntityMeta } from '../../../../models/entities/metric';
import { gridItem, gridList, gridTitle, gridValue } from '../../styles';

export interface MetaProps {
    meta: MetricEntityMeta;
    onIndomClick?: (indom: string) => void;
}

export class Meta extends React.Component<MetaProps, {}> {
    render() {
        const { props } = this;
        const { meta, onIndomClick } = props;
        const { pmid, type, semantics, units, indom, source } = meta;
        return (
            <div className={gridList}>
                <div className={gridItem} data-test="pmid">
                    <span className={gridTitle}>PMID:</span>
                    <span className={gridValue}>{pmid}</span>
                </div>
                <div className={gridItem} data-test="type">
                    <span className={gridTitle}>Type:</span>
                    <span className={gridValue}>{type}</span>
                </div>
                <div className={gridItem} data-test="semantics">
                    <span className={gridTitle}>Semantics:</span>
                    <span className={gridValue}>{semantics}</span>
                </div>
                <div className={gridItem} data-test="units">
                    <span className={gridTitle}>Units:</span>
                    <span className={gridValue}>{units}</span>
                </div>
                <div className={gridItem} data-test="indom">
                    <span className={gridTitle}>Indom:</span>
                    <span className={gridValue}>
                        {onIndomClick && indom !== 'none' && indom !== '' ? (
                            <Button
                                variant="link"
                                size="md"
                                onClick={() => onIndomClick(indom)}
                                className={css`
                                    padding: 0;
                                    margin: 0;
                                    line-height: 1;
                                    height: auto;
                                `}
                            >
                                {indom}
                            </Button>
                        ) : (
                            indom
                        )}
                    </span>
                </div>
                <div className={gridItem} data-test="source">
                    <span className={gridTitle}>Source:</span>
                    <span className={gridValue}>{source}</span>
                </div>
            </div>
        );
    }
}

export default Meta;
