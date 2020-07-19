import React from 'react';
import { Button, VerticalGroup } from '@grafana/ui';
import {
    searchHistoryListBtnWithNoSpacing,
    searchHistoryListContainer,
    searchHistoryListContainerMultiCol,
} from './styles';
import { cx } from 'emotion';
import { SearchQuery } from '../../store/slices/search/shared/state';

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

    render() {
        const { props, onSearchHistoryClick, onClearSearchHistoryClick } = this;
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
                                variant="link"
                                size="md"
                                icon="search"
                                className={searchHistoryListBtnWithNoSpacing}
                                onClick={() => onSearchHistoryClick(item)}
                                data-test="search-history-go"
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
