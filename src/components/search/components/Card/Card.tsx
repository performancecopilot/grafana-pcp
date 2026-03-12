import React from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { getCardStyles } from './styles';

export interface CardBasicProps {
    background?: 'weak' | 'strong';
    children?: React.ReactNode;
}

export type CardProps = { theme: GrafanaTheme2 } & CardBasicProps;

export const Card: React.FC<CardProps> = (props: React.PropsWithChildren<CardProps>) => {
    const background = props.background ?? 'strong';
    const styles = getCardStyles(props.theme, background);

    return (
        <div className={styles.container} data-test={background}>
            {props.children}
        </div>
    );
};

export default function CardWithTheme(props: CardBasicProps) {
    const theme = useTheme2();
    return <Card {...props} theme={theme} />;
}
