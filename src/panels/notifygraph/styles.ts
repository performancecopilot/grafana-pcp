import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const graphWrapper = css`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const infoBox = (theme: GrafanaTheme) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 11;
    border-color: ${theme.colors.formInputBorderInvalid};
`;

export const infoBoxToggle = (theme: GrafanaTheme) => css`
    position: absolute;
    right: ${theme.spacing.md};
    top: calc(${theme.spacing.md} + 2px);
    z-index: 11;
    color: ${theme.colors.formInputBorderInvalid};

    &:hover {
        color: ${theme.colors.formInputBorderInvalid};
    }
`;
