import React from 'react';
import { QueryField } from '@grafana/ui';

interface Props {
    expr: string;
    onChange: (expr: string) => void;
}

export default class BPFtraceQueryField extends React.PureComponent<Props> {
    render() {
        return (
            <QueryField
                query={this.props.expr}
                onChange={this.props.onChange}
                placeholder="Enter a bpftrace script"
                portalOrigin="bpftrace"
            />
        );
    }
}
