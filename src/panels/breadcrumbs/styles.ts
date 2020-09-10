import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const breadcrumbsContainer = (theme: GrafanaTheme) => css`
    display: flex;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    margin-left: ${theme.spacing.sm};
    margin-right: ${theme.spacing.sm};
`;

export const breadcrumbsList = (theme: GrafanaTheme) => css`
    display: flex;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    list-style-type: none;
    position: relative;
    z-index: ${theme.zIndex.dropdown - 100};
`;

export const breadcrumbsItem = (theme: GrafanaTheme) => css`
    & + & {
        margin-left: ${theme.spacing.sm};
    }
`;

export const breadcrumbsCurrentItem = (theme: GrafanaTheme) => css`
    position: relative;
    &:before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        width: calc(100% + 8px);
        height: calc(100% + 8px);
        border: 2px solid ${theme.colors.formInputBorderActive};
        border-radius: ${theme.border.radius.md};
        opacity: 0.25;
    }
`;

export const breadcrumbsBtn = (theme: GrafanaTheme) => css`
    padding-left: ${theme.spacing.sm};
    padding-right: ${theme.spacing.sm};
`;

export const breadcrumbsControl = (theme: GrafanaTheme) => css`
    min-width: 150px;
`;

export const notUsableContainer = (width: number, height: number) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${width}px;
    height: ${height}px;
`;
