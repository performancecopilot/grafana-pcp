describe('grafana-pcp setup', () => {
    before(() => {
        cy.task('grafana:reset');
    });

    beforeEach(() => {
        const user = 'admin';
        const password = 'admin';
        cy.request('POST', '/login', {
            user,
            password,
        });
    });

    it('should install grafana-pcp', () => {
        cy.visit('/plugins/performancecopilot-pcp-app/');
        cy.contains('Enable').click();
        cy.get('button').should('include.text', 'Disable');
    });

    it('should setup PCP Redis datasource', () => {
        cy.visit('/datasources/new');
        cy.contains('PCP Redis').click();
        cy.get('input[placeholder="http://localhost:44322"]').type('http://localhost:44322');
        cy.get('button[type=submit]').click();
        cy.contains('Data source is working');
    });
});
