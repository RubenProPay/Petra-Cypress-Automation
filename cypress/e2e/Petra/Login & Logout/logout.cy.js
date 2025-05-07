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

    cy.get('input[name="email"]').type('propaycypressautomation@gmail.com');
    cy.get('input[name="email"]').should('have.value', 'propaycypressautomation@gmail.com');
    cy.wait(1000);

    cy.get('input[name="password"]').type('ElongatedMango1103');
    cy.get('button[type="submit"]').first().click({ force: true });
    cy.wait(1000);

    cy.contains('button', 'Cypress Automation').click();
    cy.log('Clicked button');
    cy.wait(1000);

    cy.get('.soft-scrollbar').should('be.visible');
    cy.wait(1000);

    cy.get('#btnLogout').should('be.visible').click();
    cy.log('Clicked logout button')
  });
});