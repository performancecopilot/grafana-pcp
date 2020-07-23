import { css } from 'emotion';

const appLayout = css`
    display: grid;
    grid-template-areas:
        'header actions'
        'content aside';
    grid-template-columns: auto 250px;
    grid-template-rows: auto auto;
    grid-gap: 32px;

    @media screen and (max-width: 1024px) {
        grid-template-areas: 'header' 'content' 'actions' 'aside';
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
    }
`;

export { appLayout };
