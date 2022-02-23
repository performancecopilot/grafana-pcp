import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

const searchPageContainer = css`
    grid-area: content;
`;

const searchPageMatchesDesc = (theme: GrafanaTheme) => css`
    display: inline-block;
    color: ${theme.colors.textSemiWeak};
`;

const searchPageElapsed = (theme: GrafanaTheme) => css`
    display: inline-block;
    font-style: italic;
    color: ${theme.colors.textWeak};
`;

const paginationContainer = css`
    margin: 0 auto;
`;

export { searchPageContainer, searchPageMatchesDesc, searchPageElapsed, paginationContainer };
