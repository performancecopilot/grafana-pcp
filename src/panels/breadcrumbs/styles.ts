import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

export const breadcrumbsContainer = (theme: GrafanaTheme) => css`
    display: flex;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
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

export const breadcrumbsBtn = (theme: GrafanaTheme) => css`
    padding-left: ${theme.spacing.sm};
    padding-right: ${theme.spacing.sm};
`;

export const breadcrumbsControl = (theme: GrafanaTheme) => css`
    margin-left: ${theme.spacing.sm};
    margin-right: ${theme.spacing.sm};
`;
