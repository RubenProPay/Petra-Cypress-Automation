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

    cy.fixture('editrole').then((roleFixture) => {
      roleFixture.permissions.forEach(({ section, permission }) => {
        cy.togglePermissionInAccordion(section, permission);
      });
    });

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