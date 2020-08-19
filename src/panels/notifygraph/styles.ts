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

export const infoBoxTogglesContainer = css`
    position: absolute;
    right: 0;
    top: 0;
    z-index: 11;
`;

export const infoBoxToggle = (theme: GrafanaTheme) => css`
    padding: 6px;
    box-sizing: content-box;
    border-radius: 50%;
    background: ${theme.colors.panelBg};
    & + & {
        margin-left: ${theme.spacing.sm};
    }
`;

export const infoBoxIssueToggle = (theme: GrafanaTheme) => css`
    color: ${theme.colors.formInputBorderInvalid};
    border: 1px solid ${theme.colors.formInputBorderInvalid};

    &:hover {
        color: ${theme.colors.panelBg};

        &:before {
            background: ${theme.colors.formInputBorderInvalid};
        }
    }
`;

export const infoBoxInfoToggle = (theme: GrafanaTheme) => css`
    color: ${theme.colors.formInputText};
    border: 1px solid ${theme.colors.formInputText};

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
