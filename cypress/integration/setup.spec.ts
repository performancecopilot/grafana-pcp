describe('grafana-pcp setup', () => {
    before(() => {
        cy.task('grafana:reset');
    });

    beforeEach(() => {
        cy.login();
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

    it('should setup PCP Vector datasource', () => {
        cy.visit('/datasources/new');
        cy.contains('PCP Vector').click();
        cy.get('input[placeholder="http://localhost:44322"]').type('http://localhost:44322');
        cy.get('button[type=submit]').click();
        cy.contains('Data source is working, using Performance Co-Pilot');
    });

    it('should setup PCP bpftrace datasource', () => {
        cy.visit('/datasources/new');
        cy.contains('PCP bpftrace').click();
        cy.get('input[placeholder="http://localhost:44322"]').type('http://localhost:44322');
        cy.get('button[type=submit]').click();
        cy.contains('Data source is working, using Performance Co-Pilot');
    });
});
