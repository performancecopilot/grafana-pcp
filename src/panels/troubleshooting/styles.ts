import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

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

export const button = (theme: GrafanaTheme2) => css`
    padding: 6px;
    box-sizing: content-box;
    border-radius: 50%;
    background: ${theme.colors.background.primary};
    border: 0;

    & + & {
        margin-left: ${theme.spacing(1)};
    }
`;

export const warningButton = (theme: GrafanaTheme2) => css`
    color: ${theme.colors.error.border};

    &:hover {
        color: ${theme.colors.background.primary};

        &:before {
            background: ${theme.colors.error.border};
        }
    }
`;

export const infoButton = (theme: GrafanaTheme2) => css`
    color: ${theme.colors.text.primary};

    &:hover {
        color: ${theme.colors.background.primary};

        &:before {
            background: ${theme.colors.text.primary};
        }
    }
`;

export const modalTypography = (theme: GrafanaTheme2) => css`
    p:last-child {
        margin-bottom: 0;
    }

    ul,
    li {
        margin-left: ${theme.spacing(1)};
    }

    a {
        color: ${theme.colors.text.link};
    }
`;

export const modalArticleIcon = (theme: GrafanaTheme2) => css`
    margin-right: ${theme.spacing(1)};
`;

export const modalTooltipContent = (theme: GrafanaTheme2) => css`
    border-bottom: 1px dotted ${theme.colors.text.disabled};
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
    text-align: center;
`;
