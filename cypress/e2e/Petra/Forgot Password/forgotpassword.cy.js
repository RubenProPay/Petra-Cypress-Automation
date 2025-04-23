describe('Forgot Password', () => {
  it('goes through the forgot password flow', () => {
    
    cy.visit('/')
    cy.wait(1000);

    cy.get('a[href="https://staging.political.propaysystems.com/forgot-password"]').contains('Forgot Password?').should('be.visible').click();
    cy.wait(1000);

    cy.url().should('include', '/forgot-password');
    // cy.wait(1000);

    cy.get('a[href="https://staging.political.propaysystems.com/login"]').contains('Back').should('be.visible').click();
    cy.wait(3000);


    cy.get('a[href="https://staging.political.propaysystems.com/forgot-password"]').contains('Forgot Password?').should('be.visible').click();
    cy.wait(1000);

    cy.get('input[name="email"]').type('ruben.dasilva@propaysystems.com');
    cy.wait(1000);

    cy.get('button[type="submit"]').first().click({ force: true });
  })
})