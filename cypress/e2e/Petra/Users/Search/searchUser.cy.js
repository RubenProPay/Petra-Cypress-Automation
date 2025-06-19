describe('Navigate to User table and search', () => {
    beforeEach(() => {
      cy.loginRoot();
      cy.wait(1000);
    });
  
    it('opens the users module and clicks on search user', () => {
      cy.visit("/");
      cy.wait(1000);
      cy.sideNav('Users', 'users/user');

      cy.get('input[type="search"]')
        .should('be.visible')
        .type('CypressTest', { delay: 50 });

      cy.get('body').type('{enter}');

      cy.wait(1000);
    });
  });