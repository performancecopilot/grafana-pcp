describe('PCP Vector Checklist', () => {
    before(() => {
        cy.task('grafana:reset');
        cy.login();
        cy.enablePlugin();
        cy.addDatasource('pcp-vector-datasource', 'PCP Vector datasource');
    });

    beforeEach(() => {
        cy.login();
    });

    it('should open the checklist dashboard', () => {
        cy.visit('/d/pcp-vector-checklist');
        cy.contains('Memory Utilization');
    });
});
