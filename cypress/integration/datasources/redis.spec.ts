describe('PCP Redis datasource', () => {
    before(() => {
        cy.task('grafana:reset');
        cy.login();
        cy.enablePlugin();
        cy.addDatasource('performancecopilot-redis-datasource', 'PCP Redis datasource');
    });

    beforeEach(() => {
        cy.login();
    });

    it('should import bundled dashboards', () => {
        cy.visit('/datasources');
        cy.contains('PCP Redis').click();
        cy.contains('Dashboards').click({ force: true });
        cy.contains('td', 'PCP Redis: Host Overview').siblings().contains('Import').click();
        cy.contains('Dashboard Imported');
    });

    it('should auto-complete metric names', () => {
        cy.visit('/dashboard/new');
        cy.contains('Add a new panel').click();

        // start typing
        cy.get('.monaco-editor textarea').type('disk.dev.', { force: true });
        cy.contains('disk.dev.total_bytes'); // auto-complete

        // click on one auto-completion entry
        cy.contains('disk.dev.write_bytes').click();
        cy.get('.monaco-editor textarea').should('have.value', 'disk.dev.write_bytes').blur();

        // remove '_bytes' from query editor and type '_' to open auto-completion again
        cy.get('.monaco-editor textarea').type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}_', {
            force: true,
        });

        // click on one auto-completion entry
        cy.contains('disk.dev.write_rawactive').click();
        // if the following assertion fails, check the wordPattern setting in the Monaco Editor
        cy.get('.monaco-editor textarea').should('have.value', 'disk.dev.write_rawactive').blur();
    });
});
