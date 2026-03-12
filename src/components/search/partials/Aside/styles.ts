import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

const asideContainer = css`
    grid-area: aside;
`;

const asideButton = css`
    padding-left: 0;
    padding-right: 0;
`;

const asideButtonInactive = (theme: GrafanaTheme2) => css`
    color: ${theme.colors.text.primary};
    cursor: default;

    &:hover {
        color: ${theme.colors.text.primary};
    }
`;

export { asideContainer, asideButton, asideButtonInactive };
