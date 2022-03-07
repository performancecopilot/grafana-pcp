import './commands';

declare global {
    namespace Cypress {
        interface Chainable {
            login(username?: string, password?: string): Chainable<void>;
            enablePlugin(): Chainable<void>;
            addDatasource(type: string, name: string, url?: string): Chainable<void>;
        }
    }
}
