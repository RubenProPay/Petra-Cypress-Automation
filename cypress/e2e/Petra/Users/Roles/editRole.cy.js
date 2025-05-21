describe('Navigate to the Roles page & edit a role', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('opens the roles module and clicks edit', () => {
    cy.visit("/");
    cy.wait(1000);
    cy.sideNav('Users', 'roles');
    cy.wait(1000);

    cy.contains('Test')
      .closest('tr')
      .within(() => {
        cy.get('.fi-dropdown-trigger').click();
        cy.contains('Edit').click();
      });
    cy.wait(1000);

    cy.get('#name').should('be.visible');
    cy.wait(1000);

    cy.togglePermissionInAccordion('Members', 'View');
    // cy.togglePermissionInAccordion('Members', 'Edit');
    // cy.togglePermissionInAccordion('Members-addresses', 'View');
  });

});