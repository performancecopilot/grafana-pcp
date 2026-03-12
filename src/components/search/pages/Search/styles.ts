import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

const searchPageContainer = css`
    grid-area: content;
`;

const searchPageMatchesDesc = (theme: GrafanaTheme2) => css`
    display: inline-block;
    color: ${theme.colors.text.secondary};
`;

const searchPageElapsed = (theme: GrafanaTheme2) => css`
    display: inline-block;
    font-style: italic;
    color: ${theme.colors.text.secondary};
`;

const paginationContainer = css`
    margin: 0 auto;
`;

export { searchPageContainer, searchPageMatchesDesc, searchPageElapsed, paginationContainer };
