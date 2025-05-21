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

    cy.togglePermissionInAccordion('Members', 'view');
    cy.togglePermissionInAccordion('Members', 'edit');
    cy.togglePermissionInAccordion('Members', 'create');
    cy.togglePermissionInAccordion('Members', 'search');

    cy.togglePermissionInAccordion('Members-details', 'view');
    cy.togglePermissionInAccordion('Members-details', 'edit');

    cy.togglePermissionInAccordion('Members-addresses', 'view');
    cy.togglePermissionInAccordion('Members-addresses', 'edit');

    cy.togglePermissionInAccordion('Members-documents', 'view');
    cy.togglePermissionInAccordion('Members-documents', 'create');
    cy.togglePermissionInAccordion('Members-documents', 'delete');

    cy.togglePermissionInAccordion('Members-audit', 'view');

    cy.togglePermissionInAccordion('Waiting-rooms', 'view');
    cy.togglePermissionInAccordion('Waiting-rooms', 'edit');

    cy.togglePermissionInAccordion('Administration', 'view');

    cy.togglePermissionInAccordion('Branches', 'view');
    cy.togglePermissionInAccordion('Branches', 'edit');
    cy.togglePermissionInAccordion('Branches', 'create');
    
    cy.get('button')
      .contains('Save')
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    
    cy.wait(1000);

    cy.contains('a', 'Back')
      .should('be.visible')
      .click();

  });

});