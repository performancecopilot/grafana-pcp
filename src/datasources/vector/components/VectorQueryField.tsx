import React from 'react';
import { QueryField } from '@grafana/ui';

interface VectorQueryFieldProps {
    expr: string;
    onChange: (expr: string) => void;
};

export default class VectorQueryField extends React.PureComponent<VectorQueryFieldProps> {
    render() {
        return (
            <QueryField
                query={this.props.expr}
                onChange={this.props.onChange}
                placeholder="Enter a Performance Co-Pilot metric name"
                portalOrigin="vector"
            />
        );
    }
}
