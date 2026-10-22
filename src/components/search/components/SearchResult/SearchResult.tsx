import React from 'react';
import DOMPurify from 'dompurify';
import { GrafanaTheme2 } from '@grafana/data';
import { Button, Stack, useTheme2 } from '@grafana/ui';
import { TextItemResponse } from '../../../../common/services/pmsearch/types';
import Card from '../Card/Card';
import {
    searchResultBtnWithNoSpacing,
    searchResultDescription,
    searchResultEntityType,
    searchResultFooter,
    searchResultHeader,
    searchResultItem,
    searchResultTitle,
    searchResultTitleLink,
} from './styles';

export type SearchResultProps = { theme: GrafanaTheme2 } & {
    item: TextItemResponse;
    openDetail: (entity: TextItemResponse) => void;
};

// pmsearch highlights matches with <b>; no other markup or attributes are needed.
const sanitizeHighlight = (value: string) => DOMPurify.sanitize(value, {
    ALLOWED_TAGS: ['b'],
    ALLOWED_ATTR: [],
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
});

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
                <p dangerouslySetInnerHTML={{ __html: sanitizeHighlight(description) }}></p>
            </div>
        );
    }

    renderFooter() {
        const { props } = this;
        return (
            <footer className={searchResultFooter}>
                <Stack justifyContent="space-between" gap={3}>
                    <Button fill="text" size="md" icon="tag-alt" className={searchResultEntityType(props.theme)}>
                        {props.item.type}
                    </Button>
                    <Button
                        fill="text"
                        size="md"
                        icon="arrow-right"
                        className={searchResultBtnWithNoSpacing}
                        onClick={() => props.openDetail(props.item)}
                        data-test="read-more"
                    >
                        Read More
                    </Button>
                </Stack>
            </footer>
        );
    }

    renderName() {
        const { item } = this.props;
        if (item.name) {
            return <span data-test="name" dangerouslySetInnerHTML={{ __html: sanitizeHighlight(item.name) }}></span>;
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
                                fill="text"
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

export default function SearchResultWithTheme(props: { item: TextItemResponse; openDetail: (entity: TextItemResponse) => void }) {
    const theme = useTheme2();
    return <SearchResult {...props} theme={theme} />;
}
