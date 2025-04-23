describe('Ward Filament Query Builder', () => {
  it('Opens the filament query builder in the wards table and performs some searches', () => {
  
    cy.intercept('GET', 'https://challenges.cloudflare.com/cdn-cgi/challenge-platform/**', {
      statusCode: 200,
      body: { success: true },
    }).as('cloudflareChallenge');

    cy.visit('/');

    cy.wait('@cloudflareChallenge');

    cy.url().should('include', '/login');

    cy.get('input[name="email"]').type('ruben.dasilva@propaysystems.com');
    cy.get('input[name="email"]').should('have.value', 'ruben.dasilva@propaysystems.com');
    cy.wait(1000);

    cy.get('input[name="password"]').type('Prop@y');
    cy.get('button[type="submit"]').first().click({ force: true });
    cy.wait(1000);

    
    cy.wait(1000);

  })
})