import { GrafanaTheme } from '@grafana/data';
import { css } from 'emotion';

const cardContainer = (theme: GrafanaTheme, background: 'weak' | 'strong') => css`
    width: 100%;
    padding: ${theme.spacing.md};
    border-radius: ${theme.border.radius.sm};
    background: ${background === 'strong' ? theme.colors.bg2 : theme.colors.bg1};
`;

export { cardContainer };
