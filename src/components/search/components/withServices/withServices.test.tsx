jest.mock('../../services/PmSearchApiService');
jest.mock('../../../../common/services/pmseries/PmSeriesApiService');
jest.mock('../../services/EntityDetailService');
import { shallow } from 'enzyme';
import withServices, { WithServicesProps } from './withServices';
import React from 'react';
import PmSearchApiService from '../../services/PmSearchApiService';
import EntityService from '../../services/EntityDetailService';
import { Services } from '../../services/services';
import ServicesContext from '../../contexts/services';
import { PmSeriesApiService } from '../../../../common/services/pmseries/PmSeriesApiService';

type TestComponentProps = WithServicesProps & { test: string };

describe('withServices HOC', () => {
    const PmSearchApiServiceMock: jest.Mock<PmSearchApiService> = PmSearchApiService as any;
    const PmSeriesApiServiceMock: jest.Mock<PmSeriesApiService> = PmSeriesApiService as any;
    const EntityServiceMock: jest.Mock<EntityService> = EntityService as any;

    const searchService = new PmSearchApiServiceMock(null!, null!);
    const seriesService = new PmSeriesApiServiceMock(null!, null!);
    const entityService = new EntityServiceMock(null!, null!);

    const services: Services = {
        searchService,
        seriesService,
        entityService,
    };

    beforeEach(() => {
        PmSearchApiServiceMock.mockClear();
        PmSeriesApiServiceMock.mockClear();
        EntityServiceMock.mockClear();
    });

    test('extends wrapped component with Services and leaves other props', async () => {
        const TestComponent = (props: TestComponentProps) => {
            return <p>Component</p>;
        };

        const ComponentWithServices = withServices(TestComponent);
        const testVal = 'testVal';
        const component = shallow(<ComponentWithServices test={testVal} />, {
            wrappingComponent: ServicesContext.Provider,
            wrappingComponentProps: {
                value: services,
            },
        });
        // Leaves other props
        const props = component.dive().props() as TestComponentProps;
        expect(props.test).toBe(testVal);

        // Provided services have callable methods
        // Search methods are callable
        const searchServiceProp: jest.Mocked<PmSearchApiService> = props.services.searchService as any;
        await searchServiceProp.text(null!);
        await searchServiceProp.autocomplete(null!);
        // Series methods are callable
        const seriesServiceProp: jest.Mocked<PmSeriesApiService> = props.services.seriesService as any;
        await seriesServiceProp.descs(null!);
        await seriesServiceProp.labels(null!);
        await seriesServiceProp.metrics(null!);
        await seriesServiceProp.query(null!);
        // Entity methods are callable
        const entityServiceProp: jest.Mocked<EntityService> = props.services.entityService as any;
        await entityServiceProp.indom(null!);
        await entityServiceProp.metric(null!);

        // Check that all of above has been called
        expect(searchService.text).toHaveBeenCalled();
        expect(searchService.text).toHaveBeenCalled();
        expect(seriesService.descs).toHaveBeenCalled();
        expect(seriesService.labels).toHaveBeenCalled();
        expect(seriesService.metrics).toHaveBeenCalled();
        expect(seriesService.query).toHaveBeenCalled();
        expect(entityService.indom).toHaveBeenCalled();
        expect(entityService.metric).toHaveBeenCalled();
    });
});
