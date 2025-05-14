describe('Navigate to a User & edit', () => {
    beforeEach(() => {
      cy.loginRoot();
      cy.wait(1000);
    });
  
    it('opens the users module and clicks edit on the most recent userFixture', () => {
      cy.visit("/");
      cy.wait(1000);
      cy.sideNav('Users', 'users/user');

      cy.get('input[type="search"]')
        .should('be.visible')
        .type('Cypress', { delay: 50 });

      cy.get('body').type('{enter}');

      cy.contains('td', 'propaycypressautomation@gmail.com')
      .parents('tr')
      .within(() => {
        cy.get('button').first().click(); // Click the action menu
      });
    
      cy.contains('button', 'Edit').click(); // Click "Edit"
      cy.wait(1000);

      cy.contains('a', 'Permissions').click();

      cy.expandAccordion('Members');
    
    
    });
  });
  