import { css } from 'emotion';

const spinnerOuter = css`
    height: 200px;
    max-height: 100%;
`;

const spinnerContainer = css`
    position: relative;
    height: 100%;
`;

const spinner = css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    z-index: 20;
`;

export { spinnerOuter, spinnerContainer, spinner };
