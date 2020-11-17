import { shallow } from 'enzyme';
import React from 'react';
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
        shallow(<Actions {...mockReduxProps} />);
    });

    test('displays back to index on non-index page', () => {
        const viewSearch: ViewState = ViewState.Search;
        const wrapperSearch = shallow(<Actions {...{ ...mockReduxProps, view: viewSearch }} />);
        expect(wrapperSearch.exists('[data-test="back-to-index"]')).toBe(true);

        const viewDetail: ViewState = ViewState.Search;
        const wrapperDetail = shallow(<Actions {...{ ...mockReduxProps, view: viewDetail }} />);
        expect(wrapperDetail.exists('[data-test="back-to-index"]')).toBe(true);
    });

    test('displays back to results on detail page, when search query is available and app is on detail page', () => {
        const query: QueryState = {
            pageNum: 1,
            pattern: 'test',
            entityFlags: SearchEntity.Metrics,
        };
        const view: ViewState = ViewState.Detail;
        const wrapper = shallow(<Actions {...{ ...mockReduxDispatchProps, query, view }} />);
        expect(wrapper.exists('[data-test="back-to-results"]')).toBe(true);
    });

    test('can navigate to index', () => {
        const view: ViewState = ViewState.Search;
        const wrapper = shallow(<Actions {...{ ...mockReduxProps, view }} />);
        const button = wrapper.find('[data-test="back-to-index"]');
        button.simulate('click');
        const setView: jest.Mock<QuerySearchActionCreator> = mockReduxDispatchProps.setView as any;
        expect(setView).toHaveBeenCalled();
        expect(setView.mock.calls[0][0]).toBe(ViewState.Index);
    });

    test('can navigate to results', () => {
        const query: QueryState = {
            pageNum: 1,
            pattern: 'test',
            entityFlags: SearchEntity.Metrics,
        };
        const view: ViewState = ViewState.Detail;
        const wrapper = shallow(<Actions {...{ ...mockReduxDispatchProps, query, view }} />);
        const button = wrapper.find('[data-test="back-to-results"]');
        button.simulate('click');
        const setView: jest.Mock<SetViewActionCreator> = mockReduxDispatchProps.querySearch as any;
        expect(setView).toHaveBeenCalled();
        expect(setView.mock.calls[0][0]).toBe(query);
    });
});
