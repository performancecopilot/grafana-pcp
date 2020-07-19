import { css } from 'emotion';

const indexPageContainer = css`
    grid-area: content;
`;

const indexPageBtnWithNoSpacing = css`
    padding: 0;
`;

const indexColumnsList = css`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;

    > * {
        flex: 1 1 50%;
    }

    > *:nth-child(2n + 3),
    > *:nth-child(2n + 4) {
        margin-top: 8px;
    }

    @media screen and (max-width: 1024px) {
        > * {
            flex: 1 1 100%;
            margin-top: 8px;
        }
    }
`;

export { indexPageContainer, indexPageBtnWithNoSpacing, indexColumnsList };
