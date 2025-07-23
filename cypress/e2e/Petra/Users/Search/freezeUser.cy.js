describe('Navigate to user table and freezes a user', () => {
  const columnsToSkipByName = ['Progress'];

  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('Searches for a user & freezes', () => {
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

    cy.contains('button', 'Freeze')
      .should('be.visible')
      .click();

    cy.wait(2000);
  });

  it('Searches for a user & activates', () => {
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

    cy.contains('button', 'Activate')
      .should('be.visible')
      .click();
  });
});
