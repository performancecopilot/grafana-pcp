// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';
import { configure } from '@testing-library/react';

// The codebase uses data-test instead of the RTL default data-testid
configure({ testIdAttribute: 'data-test' });
