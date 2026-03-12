import { css, cx } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

const searchContainer = css`
    display: flex;
    grid-area: header;
`;

const searchSubmitBtn = css`
    margin-left: 16px;
`;

const searchFormGroup = css`
    display: flex;
    width: 100%;
`;

const searchBlockWrapper = css`
    width: 100%;
`;

const autosuggestWrapper = css`
    position: relative;
`;

const autosuggestIcon = (theme: GrafanaTheme2) => css`
    position: absolute;
    top: 50%;
    left: ${theme.spacing(2)};
    transform: translate(-50%, -50%);
`;

const autosuggestContainer = (theme: GrafanaTheme2) =>
    css`
        position: relative;
        height: ${theme.spacing(4)};
    `;

const autosuggestContainerOpen = css`
    /* container class when dropdown opens */
`;

const autosuggestInput = (theme: GrafanaTheme2) => {
    return cx(
        css`
            background: transparent;
            height: ${theme.spacing(4)};
            width: 100%;
            padding: 0 ${theme.spacing(2)} 0 28px;
            border-style: solid;
            border-width: 1px;
            border-color: ${theme.colors.border.medium};
            border-radius: ${theme.shape.radius.default};
        `
    );
};

const autosuggestInputOpen = css``;
const autosuggestInputFocused = css``;
const autosuggestSuggestionsContainer = (theme: GrafanaTheme2) => css`
    display: none;
    position: absolute;
    top: calc(100% + 6px);
    left: 0%;
    width: 100%;
    background: ${theme.colors.background.canvas};
    z-index: 10;
    padding: 0;
    border-style: solid;
    border-width: 1px;
    border-color: ${theme.colors.border.medium};
    border-radius: ${theme.shape.radius.default};
`;

const autosuggestSuggestionsContainerOpen = css`
    display: block !important;
`;
const autosuggestSuggestionsList = css`
    list-style-type: none;
    margin: 0;
    padding: 0;
`;
const autosuggestSuggestion = (theme: GrafanaTheme2) => css`
    background: transparent;
    line-height: ${theme.spacing(4)};
    width: 100%;
    padding: 0 ${theme.spacing(2)};
    cursor: pointer;
    & + & {
        border-top: 1px solid ${theme.colors.border.medium};
    }
`;
const autosuggestSuggestionFirst = css``;
const autosuggestSuggestionHighlighted = (theme: GrafanaTheme2) => css`
    color: ${theme.colors.primary.text};
`;
const autosuggestSectionContainer = css``;
const autosuggestSectionContainerFirst = css``;
const autosuggestSectionTitle = css``;

export {
    searchContainer,
    searchSubmitBtn,
    searchFormGroup,
    searchBlockWrapper,
    autosuggestWrapper,
    autosuggestIcon,
    autosuggestContainer,
    autosuggestContainerOpen,
    autosuggestInput,
    autosuggestInputOpen,
    autosuggestInputFocused,
    autosuggestSuggestionsContainer,
    autosuggestSuggestionsContainerOpen,
    autosuggestSuggestionsList,
    autosuggestSuggestion,
    autosuggestSuggestionFirst,
    autosuggestSuggestionHighlighted,
    autosuggestSectionContainer,
    autosuggestSectionContainerFirst,
    autosuggestSectionTitle,
};
