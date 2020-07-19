import { css } from 'emotion';
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

const autosuggestContainer = (theme: GrafanaTheme) =>
    css`
    position: relative;
    background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${encodeURIComponent(
        theme.colors.textWeak
    )}"><path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"></path></svg>');
    background-repeat: no-repeat;
    background-size: ${theme.spacing.md} ${theme.spacing.md};
    background-position: ${theme.spacing.sm};
    height: ${theme.spacing.formInputHeight}px;
  `;

const autosuggestContainerOpen = css`
    /* container class when dropdown opens */
`;

const autosuggestInput = (theme: GrafanaTheme) =>
    css`
        background: transparent;
        height: ${theme.spacing.formInputHeight}px;
        width: 100%;
        padding: 0 ${theme.spacing.md} 0 28px;
        border-style: solid;
        border-width: 1px;
        border-color: ${theme.colors.formInputBorder};
        border-radius: ${theme.border.radius.sm};

        /* Copied from https://github.com/grafana/grafana/blob/master/packages/grafana-ui/src/components/Forms/commonStyles.ts */
        &:-webkit-autofill,
        &:-webkit-autofill:hover {
            /* Welcome to 2005. This is a HACK to get rid od Chromes default autofill styling */
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0), inset 0 0 0 100px ${theme.colors.formInputBg}!important;
            -webkit-text-fill-color: ${theme.colors.formInputText} !important;
        }
        &:-webkit-autofill:focus {
            /* Welcome to 2005. This is a HACK to get rid od Chromes default autofill styling */
            box-shadow: 0 0 0 2px ${theme.colors.bodyBg}, 0 0 0px 4px ${theme.colors.formFocusOutline},
                inset 0 0 0 1px rgba(255, 255, 255, 0), inset 0 0 0 100px ${theme.colors.formInputBg}!important;
            -webkit-text-fill-color: ${theme.colors.formInputText} !important;
        }
        &:hover {
            border-color: ${theme.colors.formInputBorder};
        }
        &:focus {
            outline: 2px dotted transparent;
            outline-offset: 2px;
            box-shadow: 0 0 0 2px ${theme.colors.bodyBg}, 0 0 0px 4px ${theme.colors.formFocusOutline};
            transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
        }
        &:disabled {
            background-color: ${theme.colors.formInputBgDisabled};
            color: ${theme.colors.formInputDisabledText};
        }
        &::placeholder {
            color: ${theme.colors.formInputPlaceholderText};
            opacity: 1;
        }
    `;
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
