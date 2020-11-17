import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

const asideContainer = css`
    grid-area: aside;
`;

const asideButton = css`
    padding-left: 0;
    padding-right: 0;
`;

const asideButtonInactive = (theme: GrafanaTheme) => css`
    color: ${theme.colors.text};
    cursor: default;

    &:hover {
        color: ${theme.colors.text};
    }
`;

export { asideContainer, asideButton, asideButtonInactive };
