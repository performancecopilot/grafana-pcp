import React from 'react';
import { QueryField } from '@grafana/ui';

interface RedisQueryFieldProps {
    expr: string;
    onChange: (expr: string) => void;
}

export default class RedisQueryField extends React.PureComponent<RedisQueryFieldProps> {
    render() {
        return (
            <QueryField
                query={this.props.expr}
                onChange={this.props.onChange}
                placeholder="Enter a Performance Co-Pilot metric name"
                portalOrigin="redis"
            />
        );
    }
}
