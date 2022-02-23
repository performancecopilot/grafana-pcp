import React from 'react';
import { useAsync } from 'react-use';
import { ErrorWithStack, LoadingPlaceholder } from '@grafana/ui';
import { MonacoEditorWrapperProps } from './MonacoEditorWrapper';

// COPY FROM https://github.com/grafana/grafana/blob/master/packages/grafana-ui/src/components/Monaco/CodeEditorLazy.tsx
// duplication is required to get access to the monaco object
export const MonacoEditorLazy: React.FC<MonacoEditorWrapperProps> = props => {
    const { loading, error, value } = useAsync(async () => {
        return await import(/* webpackChunkName: "monaco-editor" */ './MonacoEditorWrapper');
    });

    if (loading) {
        return <LoadingPlaceholder text={''} />;
    }

    if (error) {
        return (
            <ErrorWithStack
                title="Code editor failed to load"
                error={error}
                errorInfo={{ componentStack: error?.stack || '' }}
            />
        );
    }

    const MonacoEditor = (value as any).default;
    return <MonacoEditor {...props} />;
};
