import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getCardStyles = (theme: GrafanaTheme2, background: 'weak' | 'strong') => {
    return {
        container: css`
            width: 100%;
            padding: ${theme.spacing(2)};
            border-radius: ${theme.shape.radius.default};
            background: ${background === 'strong' ? theme.colors.background.secondary : theme.colors.background.primary};
        `,
    };
};
