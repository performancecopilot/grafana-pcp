import React from 'react';
import { render } from '@testing-library/react';
import { PmSearchApiService } from '../../../../common/services/pmsearch/PmSearchApiService';
import { PmSeriesApiService } from '../../../../common/services/pmseries/PmSeriesApiService';
import ServicesContext from '../../contexts/services';
import EntityService from '../../services/EntityDetailService';
import { Services } from '../../services/services';
import withServices, { WithServicesProps } from './withServices';

jest.mock('../../../../common/services/pmsearch/PmSearchApiService');
jest.mock('../../../../common/services/pmseries/PmSeriesApiService');
jest.mock('../../services/EntityDetailService');

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
        let capturedProps: TestComponentProps | null = null;
        const TestComponent = (props: TestComponentProps) => {
            capturedProps = props;
            return <p>Component</p>;
        };

        const ComponentWithServices = withServices(TestComponent);
        const testVal = 'testVal';

        render(
            <ServicesContext.Provider value={services}>
                <ComponentWithServices test={testVal} />
            </ServicesContext.Provider>
        );

        // Leaves other props
        expect(capturedProps!.test).toBe(testVal);

        // Provided services have callable methods
        const searchServiceProp: jest.Mocked<PmSearchApiService> = capturedProps!.services.searchService as any;
        await searchServiceProp.text(null!);
        await searchServiceProp.autocomplete(null!);

        const seriesServiceProp: jest.Mocked<PmSeriesApiService> = capturedProps!.services.seriesService as any;
        await seriesServiceProp.descs(null!);
        await seriesServiceProp.labels(null!);
        await seriesServiceProp.metrics(null!);
        await seriesServiceProp.query(null!);

        const entityServiceProp: jest.Mocked<EntityService> = capturedProps!.services.entityService as any;
        await entityServiceProp.indom(null!);
        await entityServiceProp.metric(null!);

        // Check that all of the above has been called
        expect(searchService.text).toHaveBeenCalled();
        expect(searchService.autocomplete).toHaveBeenCalled();
        expect(seriesService.descs).toHaveBeenCalled();
        expect(seriesService.labels).toHaveBeenCalled();
        expect(seriesService.metrics).toHaveBeenCalled();
        expect(seriesService.query).toHaveBeenCalled();
        expect(entityService.indom).toHaveBeenCalled();
        expect(entityService.metric).toHaveBeenCalled();
    });
});
