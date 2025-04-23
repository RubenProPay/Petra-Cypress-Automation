describe('Petra Logout', () => {
  it('logs out of Petra staging', () => {
    // Intercept the Cloudflare challenge request and mock a successful response
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

    cy.contains('button', 'Ruben Da Silva').click();
    cy.log('Clicked Ruben Da Silva button');
    cy.wait(1000);

    cy.get('.soft-scrollbar').should('be.visible');
    cy.wait(1000);

    cy.get('#btnLogout').should('be.visible').click();
    cy.log('Clicked logout button')
  });
});