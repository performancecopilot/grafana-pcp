import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchEntity } from '../../../../common/services/pmsearch/types';
import { QuerySearchActionCreator } from '../../store/slices/search/shared/actionCreators';
import { initialQuery, QueryState } from '../../store/slices/search/slices/query/state';
import { SetViewActionCreator } from '../../store/slices/search/slices/view/actionCreators';
import { initialView, ViewState } from '../../store/slices/search/slices/view/state';
import { Actions } from './Actions';

interface ActionsReduxStatePropsMock {
    query: QueryState;
    view: ViewState;
}

interface ActionsReduxDispatchPropsMock {
    querySearch: QuerySearchActionCreator;
    setView: SetViewActionCreator;
}

type ActionsReduxPropsMock = ActionsReduxStatePropsMock & ActionsReduxDispatchPropsMock;

describe('<Actions/>', () => {
    let mockReduxStateProps: ActionsReduxStatePropsMock;
    let mockReduxDispatchProps: ActionsReduxDispatchPropsMock;
    let mockReduxProps: ActionsReduxPropsMock;

    beforeEach(() => {
        mockReduxStateProps = {
            query: initialQuery(),
            view: initialView(),
        };
        mockReduxDispatchProps = {
            querySearch: jest.fn(),
            setView: jest.fn(),
        };
        mockReduxProps = { ...mockReduxStateProps, ...mockReduxDispatchProps };
    });

    test('renders without crashing', () => {
        render(<Actions {...mockReduxProps} />);
    });

    test('displays back to index on non-index page', () => {
        const { unmount } = render(<Actions {...{ ...mockReduxProps, view: ViewState.Search }} />);
        expect(screen.getByTestId('back-to-index')).toBeInTheDocument();
        unmount();

        render(<Actions {...{ ...mockReduxProps, view: ViewState.Detail }} />);
        expect(screen.getByTestId('back-to-index')).toBeInTheDocument();
    });

    test('displays back to results on detail page, when search query is available and app is on detail page', () => {
        const query: QueryState = {
            pageNum: 1,
            pattern: 'test',
            entityFlags: SearchEntity.Metrics,
        };
        const view: ViewState = ViewState.Detail;
        render(<Actions {...{ ...mockReduxDispatchProps, query, view }} />);
        expect(screen.getByTestId('back-to-results')).toBeInTheDocument();
    });

    test('can navigate to index', async () => {
        render(<Actions {...{ ...mockReduxProps, view: ViewState.Search }} />);
        await userEvent.click(screen.getByTestId('back-to-index'));
        const setView = mockReduxDispatchProps.setView as jest.Mock<SetViewActionCreator>;
        expect(setView).toHaveBeenCalled();
        expect(setView.mock.calls[0][0]).toBe(ViewState.Index);
    });

    test('can navigate to results', async () => {
        const query: QueryState = {
            pageNum: 1,
            pattern: 'test',
            entityFlags: SearchEntity.Metrics,
        };
        const view: ViewState = ViewState.Detail;
        render(<Actions {...{ ...mockReduxDispatchProps, query, view }} />);
        await userEvent.click(screen.getByTestId('back-to-results'));
        const querySearch = mockReduxDispatchProps.querySearch as jest.Mock<QuerySearchActionCreator>;
        expect(querySearch).toHaveBeenCalled();
        expect(querySearch.mock.calls[0][0]).toBe(query);
    });
});
