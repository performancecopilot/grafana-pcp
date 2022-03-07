Cypress.Commands.add('login', (username: string = 'admin', password: string = 'admin') => {
    cy.request('POST', '/login', {
        user: username,
        password,
    });
});

Cypress.Commands.add('enablePlugin', () => {
    cy.request('POST', '/api/plugins/performancecopilot-pcp-app/settings', {
        enabled: true,
        pinned: true,
    });
});

Cypress.Commands.add('addDatasource', (type: string, name: string, url: string = 'http://localhost:44322') => {
    cy.request('POST', '/api/datasources', {
        type,
        name,
        access: 'proxy',
        isDefault: true,
        url,
    });
});
