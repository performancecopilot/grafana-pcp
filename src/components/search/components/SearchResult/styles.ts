import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

const searchResultItem = css`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const searchResultHeader = css``;

const searchResultTitle = css`
    margin-bottom: 16px;
`;

const searchResultDescription = css`
    margin-bottom: 8px;
    white-space: pre-line;

    > p:last-child {
        margin-bottom: 0;
    }
`;

const searchResultFooter = css``;

const searchResultBtnWithNoSpacing = css`
    padding: 0;
`;

const searchResultEntityType = (theme: GrafanaTheme2) => css`
    padding: 0;
    cursor: default;
    pointer-events: none;
    text-transform: capitalize;
    color: ${theme.colors.text.primary};
`;

const searchResultTitleLink = (theme: GrafanaTheme2) => css`
    padding: 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.h4.fontSize};
    font-weight: normal;

    &:hover {
        color: ${theme.colors.text.link};
    }
`;

export {
    searchResultItem,
    searchResultHeader,
    searchResultTitle,
    searchResultDescription,
    searchResultFooter,
    searchResultBtnWithNoSpacing,
    searchResultEntityType,
    searchResultTitleLink,
};
