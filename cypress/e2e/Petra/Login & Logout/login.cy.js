describe('Petra Login', () => {
  it('logs onto Petra staging', () => {
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
  });
});