import React from 'react';
import { Services } from '../services/services';

// Ugly hack -> we never use do ServiceContext.Provider without populating context with value first.
const ServicesContext = React.createContext<Services>({} as Services);

export default ServicesContext;
