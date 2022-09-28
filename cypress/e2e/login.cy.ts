describe('Grafana', () => {
    before(() => {
        cy.task('grafana:reset');
    });

    it('login', () => {
        cy.visit('/');
        cy.get('[name=user]').type('admin');
        cy.get('[name=password]').type('admin');
        cy.contains('Log in').click();
        cy.contains('Logged in');
    });
});
