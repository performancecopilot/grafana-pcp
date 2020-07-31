import React from 'react';
import { HorizontalGroup, Button, withTheme, Themeable } from '@grafana/ui';

import {
    searchResultDescription,
    searchResultFooter,
    searchResultBtnWithNoSpacing,
    searchResultItem,
    searchResultHeader,
    searchResultTitle,
    searchResultTitleLink,
    searchResultEntityType,
} from './styles';
import { TextItemResponse } from '../../models/endpoints/search';
import Card from '../Card/Card';

export type SearchResultProps = Themeable & {
    item: TextItemResponse;
    openDetail: (entity: TextItemResponse) => void;
};

export class SearchResult extends React.PureComponent<SearchResultProps, {}> {
    constructor(props: SearchResultProps) {
        super(props);
        this.renderName = this.renderName.bind(this);
        this.renderDesc = this.renderDesc.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    renderDesc() {
        const { item } = this.props;
        let description;
        if (item.oneline) {
            description = item.oneline;
        } else if (item.helptext) {
            description = item.helptext;
        } else {
            description = 'No description.';
        }
        return (
            <div className={searchResultDescription} data-test="description">
                <p dangerouslySetInnerHTML={{ __html: description }}></p>
            </div>
        );
    }

    renderFooter() {
        const { props } = this;
        return (
            <footer className={searchResultFooter}>
                <HorizontalGroup spacing="lg" justify="space-between">
                    <Button variant="link" size="md" icon="tag-alt" className={searchResultEntityType(props.theme)}>
                        {props.item.type}
                    </Button>
                    <Button
                        variant="link"
                        size="md"
                        icon="arrow-right"
                        className={searchResultBtnWithNoSpacing}
                        onClick={() => props.openDetail(props.item)}
                        data-test="read-more"
                    >
                        Read More
                    </Button>
                </HorizontalGroup>
            </footer>
        );
    }

    renderName() {
        const { item } = this.props;
        if (item.name) {
            return <span data-test="name" dangerouslySetInnerHTML={{ __html: item.name }}></span>;
        } else {
            return <span data-test="name">Name is missing.</span>;
        }
    }

    render() {
        const { renderDesc, renderFooter, renderName, props } = this;
        return (
            <Card background="strong">
                <article className={searchResultItem}>
                    <header className={searchResultHeader}>
                        <h4 className={searchResultTitle}>
                            <Button
                                variant="link"
                                size="md"
                                className={searchResultTitleLink(props.theme)}
                                onClick={() => this.props.openDetail(props.item)}
                            >
                                {renderName()}
                            </Button>
                        </h4>
                    </header>
                    {renderDesc()}
                    {renderFooter()}
                </article>
            </Card>
        );
    }
}

export default withTheme(SearchResult);
