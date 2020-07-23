import { css, cx } from 'emotion';
import { getFormStyles } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';

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

const autosuggestIcon = (theme: GrafanaTheme) => css`
    position: absolute;
    top: 50%;
    left: ${theme.spacing.md};
    transform: translate(-50%, -50%);
`;

const autosuggestContainer = (theme: GrafanaTheme) =>
    css`
        position: relative;
        height: ${theme.spacing.formInputHeight}px;
    `;

const autosuggestContainerOpen = css`
    /* container class when dropdown opens */
`;

const autosuggestInput = (theme: GrafanaTheme) => {
    const formStyles = getFormStyles(theme, { size: 'md', variant: 'primary', invalid: false });
    return cx(
        formStyles.input.input,
        css`
            background: transparent;
            height: ${theme.spacing.formInputHeight}px;
            width: 100%;
            padding: 0 ${theme.spacing.md} 0 28px;
            border-style: solid;
            border-width: 1px;
            border-color: ${theme.colors.formInputBorder};
            border-radius: ${theme.border.radius.sm};
        `
    );
};

const autosuggestInputOpen = css``;
const autosuggestInputFocused = css``;
const autosuggestSuggestionsContainer = (theme: GrafanaTheme) => css`
    display: none;
    position: absolute;
    top: calc(100% + 6px);
    left: 0%;
    width: 100%;
    background: ${theme.colors.bodyBg};
    z-index: 10;
    padding: 0;
    border-style: solid;
    border-width: 1px;
    border-color: ${theme.colors.formInputBorder};
    border-radius: ${theme.border.radius.sm};
`;

const autosuggestSuggestionsContainerOpen = css`
    display: block !important;
`;
const autosuggestSuggestionsList = css`
    list-style-type: none;
    margin: 0;
    padding: 0;
`;
const autosuggestSuggestion = (theme: GrafanaTheme) => css`
    background: transparent;
    line-height: ${theme.spacing.formInputHeight}px;
    width: 100%;
    padding: 0 ${theme.spacing.md};
    cursor: pointer;
    & + & {
        border-top: 1px solid ${theme.colors.formInputBorder};
    }
`;
const autosuggestSuggestionFirst = css``;
const autosuggestSuggestionHighlighted = (theme: GrafanaTheme) => css`
    color: ${theme.colors.textBlue};
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
