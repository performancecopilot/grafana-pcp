import { cx } from 'emotion';
import React from 'react';
import { Button, VerticalGroup } from '@grafana/ui';
import { SearchQuery } from '../../store/slices/search/shared/state';
import { wrappedBtn } from '../../styles';
import { SearchEntityUtil } from '../../utils/SearchEntityUtil';
import {
    searchHistoryListBtnWithNoSpacing,
    searchHistoryListContainer,
    searchHistoryListContainerMultiCol,
} from './styles';

export interface SearchHistoryListProps {
    showClearBtn?: boolean;
    multiCol?: boolean;
    searchHistory: SearchQuery[];
    onSearchHistoryClick: (query: SearchQuery) => void;
    onClearSearchHistoryClick: () => void;
}

export class SearchHistoryList extends React.Component<SearchHistoryListProps, {}> {
    static defaultProps: Required<Pick<SearchHistoryListProps, 'showClearBtn' | 'multiCol'>> = {
        showClearBtn: true,
        multiCol: true,
    };

    constructor(props: SearchHistoryListProps) {
        super(props);
        this.onClearSearchHistoryClick = this.onClearSearchHistoryClick.bind(this);
        this.onSearchHistoryClick = this.onSearchHistoryClick.bind(this);
    }

    onSearchHistoryClick(query: SearchQuery) {
        this.props.onSearchHistoryClick(query);
    }

    onClearSearchHistoryClick() {
        this.props.onClearSearchHistoryClick();
    }

    searchHistoryItemDesc(query: SearchQuery) {
        let desc = `${query.pattern}`;
        const types = SearchEntityUtil.toEntityTypes(query.entityFlags);
        if (types.length > 0) {
            desc += ` (types: ${types.join(', ')})`;
        }
        return desc;
    }

    render() {
        const { props, onSearchHistoryClick, onClearSearchHistoryClick, searchHistoryItemDesc } = this;
        const { searchHistory } = props;

        if (searchHistory.length === 0) {
            return <p>No search queries in history.</p>;
        }

        return (
            <VerticalGroup spacing="md">
                <h4>Search History:</h4>
                <VerticalGroup spacing="md">
                    <div
                        className={
                            props.multiCol
                                ? cx(searchHistoryListContainer, searchHistoryListContainerMultiCol)
                                : searchHistoryListContainer
                        }
                        data-test={props.multiCol ? 'multicol' : 'singlecol'}
                    >
                        {searchHistory.map((item, index) => (
                            <Button
                                key={index}
                                fill="text"
                                size="md"
                                icon="search"
                                className={cx(searchHistoryListBtnWithNoSpacing, wrappedBtn)}
                                onClick={() => onSearchHistoryClick(item)}
                                data-test="search-history-go"
                                title={searchHistoryItemDesc(item)}
                            >
                                {item.pattern}
                            </Button>
                        ))}
                    </div>
                    {props.showClearBtn && (
                        <Button
                            variant="destructive"
                            size="md"
                            icon="trash-alt"
                            onClick={onClearSearchHistoryClick}
                            data-test="search-history-reset"
                        >
                            Clear History
                        </Button>
                    )}
                </VerticalGroup>
            </VerticalGroup>
        );
    }
}

export default SearchHistoryList;
