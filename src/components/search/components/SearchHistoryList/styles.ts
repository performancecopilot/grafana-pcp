import { css } from 'emotion';

const searchHistoryListBtnWithNoSpacing = css`
    padding: 0;
`;

const searchHistoryListContainer = css`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;

    > * {
        flex: 1 1 100%;
        max-width: 100%;
    }

    @media screen and (max-width: 1024px) {
        > * {
            flex: 1 1 100%;
            margin-top: 8px;
        }
    }
`;

const searchHistoryListContainerMultiCol = css`
    > * {
        flex: 1 1 calc(50% - 5px);
        max-width: calc(50% - 5px);
    }

    > *:nth-child(2n + 3),
    > *:nth-child(2n + 4) {
        margin-top: 8px;
    }
`;

export { searchHistoryListBtnWithNoSpacing, searchHistoryListContainer, searchHistoryListContainerMultiCol };
