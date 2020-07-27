import React from 'react';
import { gridList, gridValue, gridItem, gridListSingleCol } from '../../styles';
import { VerticalGroup } from '@grafana/ui';
import { cx } from 'emotion';
import { IndomEntitySparseItem } from '../../../../models/entities/indom';

export interface InstancesProps {
    instances: IndomEntitySparseItem[];
}

export class Instances extends React.Component<InstancesProps, {}> {
    render() {
        const { instances } = this.props;

        if (instances.length) {
            return (
                <VerticalGroup spacing="md">
                    <h3 data-test="instances">Instances:</h3>
                    <div className={cx(gridList, gridListSingleCol)}>
                        {instances.map((instance, i) => (
                            <div className={gridItem} key={i}>
                                <span className={gridValue} data-test={`instance-${instance.name}`}>
                                    {instance.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </VerticalGroup>
            );
        }

        return <p>No instances.</p>;
    }
}

export default Instances;
