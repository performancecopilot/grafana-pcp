import React from 'react';
import { Themeable, withTheme } from '@grafana/ui';
import { getCardStyles } from './styles';

export interface CardBasicProps {
    background?: 'weak' | 'strong';
}

export type CardProps = Themeable & CardBasicProps;

export const Card: React.FC<CardProps> = (props: React.PropsWithChildren<CardProps>) => {
    const background = props.background ?? 'strong';
    const styles = getCardStyles(props.theme, background);

    return (
        <div className={styles.container} data-test={background}>
            {props.children}
        </div>
    );
};

export default withTheme(Card);
