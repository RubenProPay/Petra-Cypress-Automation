describe('Navigate to user table and impersonate a user', () => {
  const columnsToSkipByName = ['Progress'];

  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('Searches for a user & impersonates', () => {
    cy.visit('/');
    cy.sideNav('Users', 'users/user');

    cy.get('input[type="search"]')
      .should('be.visible')
      .type('CypressTest', { delay: 50 });

    cy.get('body').type('{enter}');
    cy.wait(1000);

    cy.contains('td', '@cypresstest.com')
      .parents('tr')
      .within(() => {
        cy.get('button').first().click();
      });

    cy.contains('button', 'Impersonate')
      .should('be.visible')
      .click();

    cy.wait(2000);

    cy.contains('p', 'CypressTestUser CypressTestUser')
        .should('be.visible')
        .parents('div.max-w-md')
        .within(() => {
          cy.contains('a', 'Exit')
            .should('be.visible')
            .click({ force: true });
        });
  });
});
