import React from 'react';
import ServicesContext from '../../contexts/services';
import { Services } from '../../services/services';

export interface WithServicesProps {
    services: Services;
}

const withServices = <P extends WithServicesProps>(Component: React.ComponentType<P>) => {
    return function WithServices(props: Pick<P, Exclude<keyof P, keyof WithServicesProps>>) {
        // https://github.com/Microsoft/TypeScript/issues/28938
        // since TS 3.2 spread erases type
        return (
            <ServicesContext.Consumer>
                {services => <Component {...(props as P)} services={services} />}
            </ServicesContext.Consumer>
        );
    };
};

export default withServices;
