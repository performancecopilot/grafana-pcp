import React from 'react';
import { gridList, gridTitle, gridValue, gridItem } from '../../styles';
import { MetricEntityMeta } from '../../../../models/entities/metric';

export interface MetaProps {
    meta: MetricEntityMeta;
}

export class Meta extends React.Component<MetaProps, {}> {
    render() {
        const { pmid, type, semantics, units, indom, source } = this.props.meta;
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
                    <span className={gridValue}>{indom}</span>
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
