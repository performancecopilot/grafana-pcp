import { css, cx } from '@emotion/css';
import React from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { Spinner, useTheme2 } from '@grafana/ui';
import { spinner, spinnerContainer, spinnerOuter } from './styles';

export interface LoaderBasicProps {
    loaded: boolean;
    boundedContainer?: boolean;
    children?: React.ReactNode;
}

export type LoaderProps = { theme: GrafanaTheme2 } & LoaderBasicProps;

export class Loader extends React.Component<LoaderProps, {}> {
    constructor(props: LoaderProps) {
        super(props);
    }

    render() {
        const { loaded, theme } = this.props;
        if (loaded) {
            return this.props.children;
        }
        return (
            <div className={spinnerOuter}>
                <div className={spinnerContainer}>
                    <div
                        className={cx(
                            spinner,
                            css`
                                background-color: ${theme.colors.background.primary}8f;
                            `
                        )}
                        data-test="spinner-container"
                    >
                        <Spinner size={40} />
                    </div>
                    <div data-test="content-container">{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export default function LoaderWithTheme(props: LoaderBasicProps) {
    const theme = useTheme2();
    return <Loader {...props} theme={theme} />;
}
