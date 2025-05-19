describe('Navigate to the Roles page & edit a role', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('opens the roles module and clicks edit', () => {
    cy.visit("/");
    cy.wait(1000);
    cy.sideNav('Users', 'roles');

    cy.contains('Test')
      .closest('tr')
      .within(() => {
        cy.get('.fi-dropdown-trigger').click();
        cy.contains('Edit').click();
      });
    cy.wait(1000);
    cy.get('#name').should('be.visible');

    cy.wait(1000);

    cy.get('div.max-w-3xl.mx-auto.divide-y.divide-gray-200')
      .contains('span', 'Members-addresses')
      .closest('button')
      .click({force: true});

    // cy.expandAccordion('Members-addresses');
  });

});