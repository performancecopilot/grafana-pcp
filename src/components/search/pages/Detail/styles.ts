import { css } from 'emotion';
import { GrafanaTheme } from '@grafana/data';

const detailPageContainer = css`
    grid-area: content;
`;

const detailPageItem = css`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const detailPageHeader = css``;

const detailPageTitle = css`
    margin-bottom: 16px;
`;

const detailPageEntityType = (theme: GrafanaTheme) => css`
    margin-bottom: 16px;
    padding: 0;
    cursor: default;
    pointer-events: none;
    text-transform: capitalize;
    color: ${theme.colors.text};
`;

const detailPageDescription = css`
    margin-bottom: 8px;
    white-space: pre-line;

    > p:last-child {
        margin-bottom: 0;
    }
`;

const detailPageActions = css`
    margin-top: 16px;
`;

const detailPageProperties = css`
    width: 100%;
`;

const detailPageBtn = css`
    padding: 0;
`;

const gridList = css`
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;

    > * {
        flex: 1 1 calc(50% - 5px);
        max-width: calc(50% - 5px);
    }

    > *:nth-child(2n + 3),
    > *:nth-child(2n + 4) {
        margin-top: 8px;
    }

    @media screen and (max-width: 600px) {
        > * {
            flex: 1 1 100%;
            margin-top: 8px;
        }
    }
`;

const gridListSingleCol = css`
    > * {
        flex: 1 1 100%;
        max-width: 100%;
    }

    > * + * {
        margin-top: 8px;
    }
`;

const gridItem = css``;

const gridTitle = css`
    display: block;
    font-weight: bold;
`;

const gridValue = css`
    display: block;
`;

const instanceDomainContent = css``;

const instanceDomainItemList = css`
    margin-left: 1rem;
    margin-bottom: 1rem;
`;

const radioBtnGroupContainer = css`
    width: 100%;
`;

export {
    detailPageContainer,
    detailPageItem,
    detailPageHeader,
    detailPageTitle,
    detailPageEntityType,
    detailPageDescription,
    detailPageActions,
    detailPageProperties,
    detailPageBtn,
    gridList,
    gridListSingleCol,
    gridItem,
    gridTitle,
    gridValue,
    radioBtnGroupContainer,
    instanceDomainContent,
    instanceDomainItemList,
};
