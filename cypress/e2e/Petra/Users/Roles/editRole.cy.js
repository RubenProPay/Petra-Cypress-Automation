describe('Navigate to the Roles page & edit a role', () => {
    beforeEach(() => {
      cy.loginRoot();
      cy.wait(1000);
  
      });
    it('opens the roles module and clicks edit', () => {
      cy.visit("/");
      cy.wait(1000);
      cy.sideNav('Users', 'roles');
     
    });
});