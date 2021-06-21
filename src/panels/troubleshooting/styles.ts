import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

export const graphWrapper = css`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const buttons = css`
    position: absolute;
    right: 0;
    top: 0;
    z-index: 11;
`;

export const button = (theme: GrafanaTheme) => css`
    padding: 6px;
    box-sizing: content-box;
    border-radius: 50%;
    background: ${theme.colors.panelBg};
    border: 0;

    & + & {
        margin-left: ${theme.spacing.sm};
    }
`;

export const warningButton = (theme: GrafanaTheme) => css`
    color: ${theme.colors.formInputBorderInvalid};

    &:hover {
        color: ${theme.colors.panelBg};

        &:before {
            background: ${theme.colors.formInputBorderInvalid};
        }
    }
`;

export const infoButton = (theme: GrafanaTheme) => css`
    color: ${theme.colors.formInputText};

    &:hover {
        color: ${theme.colors.panelBg};

        &:before {
            background: ${theme.colors.formInputText};
        }
    }
`;

export const modalTypography = (theme: GrafanaTheme) => css`
    p:last-child {
        margin-bottom: 0;
    }

    ul,
    li {
        margin-left: ${theme.spacing.sm};
    }

    a {
        color: ${theme.colors.linkExternal};
    }
`;

export const modalArticleIcon = (theme: GrafanaTheme) => css`
    margin-right: ${theme.spacing.sm};
`;

export const modalTooltipContent = (theme: GrafanaTheme) => css`
    border-bottom: 1px dotted ${theme.colors.textFaint};
`;

export const modalRelativesLinksContainer = css`
    display: flex;
    width: 100%;
    justify-content: space-between;

    @media screen and (max-width: 992px) {
        flex-direction: column;
    }
`;

export const modalParentsLinks = css`
    margin-right: auto;
`;

export const modalChildrenLinks = css`
    margin-left: auto;
`;

export const notUsableContainer = (width: number, height: number) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${width}px;
    height: ${height}px;
`;
