import { GrafanaTheme } from '@grafana/data';
import { stylesFactory } from '@grafana/ui';
import { css } from 'emotion';

export const getCardStyles = stylesFactory((theme: GrafanaTheme, background: 'weak' | 'strong') => {
    return {
        container: css`
            width: 100%;
            padding: ${theme.spacing.md};
            border-radius: ${theme.border.radius.sm};
            background: ${background === 'strong' ? theme.colors.bg2 : theme.colors.bg1};
        `,
    };
});
