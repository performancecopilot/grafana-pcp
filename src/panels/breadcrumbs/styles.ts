import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const breadcrumbsContainer = (theme: GrafanaTheme2) => css`
    display: flex;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    margin-left: ${theme.spacing(1)};
    margin-right: ${theme.spacing(1)};
`;

export const breadcrumbsList = (theme: GrafanaTheme2) => css`
    display: flex;
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    list-style-type: none;
    position: relative;
    z-index: ${theme.zIndex.dropdown - 100};
`;

export const breadcrumbsItem = (theme: GrafanaTheme2) => css`
    & + & {
        margin-left: ${theme.spacing(1)};
    }
`;

export const breadcrumbsCurrentItem = (theme: GrafanaTheme2) => css`
    position: relative;
    &:before {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        width: calc(100% + 8px);
        height: calc(100% + 8px);
        border: 2px solid ${theme.colors.primary.border};
        border-radius: ${theme.shape.radius.default};
        opacity: 0.25;
    }
`;

export const breadcrumbsBtn = (theme: GrafanaTheme2) => css`
    padding-left: ${theme.spacing(1)};
    padding-right: ${theme.spacing(1)};
`;

export const breadcrumbsControl = (theme: GrafanaTheme2) => css`
    min-width: 150px;
`;

export const notUsableContainer = (width: number, height: number) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${width}px;
    height: ${height}px;
`;
