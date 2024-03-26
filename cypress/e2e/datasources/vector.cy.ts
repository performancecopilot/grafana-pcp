describe('PCP Vector data source', () => {
    before(() => {
        cy.task('grafana:reset');
        cy.login();
        cy.enablePlugin();
        cy.addDatasource('performancecopilot-vector-datasource', 'PCP Vector data source');
    });

    beforeEach(() => {
        cy.login();
    });

    it('should import bundled dashboards', () => {
        cy.visit('/datasources');
        cy.contains('PCP Vector').click();
        cy.contains('Dashboards').click({ force: true });
        cy.contains('td', 'PCP Vector: Host Overview').siblings().contains('Import').click({ force: true });
        cy.contains('Dashboard Imported');
    });

    it('should auto-complete metric names', () => {
        cy.visit('/dashboard/new');

        //test for Grafana 10 UI
        cy.get('body').then(($body) => {
            if ($body.text().search('Add a new panel') > 0) {
              cy.contains('Add a new panel').click();
            } else {
              cy.contains('Add visualization').click();
              cy.contains('PCP Vector').click();;
            }
        });

        // start typing
        cy.get('.monaco-editor').type('disk.dev.write_b');
        // auto-complete
        cy.contains('disk.dev.write_bytes');
        cy.contains('Semantics: counter');
        cy.contains('Units: Kbyte');
        cy.contains('per-disk count of bytes written');

        // accept a suggestion
        cy.contains('disk.dev.write_bytes').type('{enter}');
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
