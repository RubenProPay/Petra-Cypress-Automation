describe('VF+ PRD Login', () => {
  it('logs onto VF+ PRD site', () => {
    // Intercept the Cloudflare challenge request and mock a successful response
    cy.intercept('GET', 'https://challenges.cloudflare.com/cdn-cgi/challenge-platform/**', {
      statusCode: 200,
      body: { success: true },
    }).as('cloudflareChallenge');

    cy.visit('https://vfplus.datakrag.co.za/');

    cy.wait('@cloudflareChallenge');

    cy.url().should('include', '/login');

    cy.get('input[name="email"]').type('ruben.dasilva@propaysystems.com');
    cy.get('input[name="email"]').should('have.value', 'ruben.dasilva@propaysystems.com');
    cy.wait(1000);

    cy.get('input[name="password"]').type('YWZNxJepZPd7kiq!');
    cy.get('button[type="submit"]').first().click({ force: true });
    cy.wait(1000);

    cy.sideNavPrd('Administration', 'https://vfplus.datakrag.co.za/global');
    cy.wait(1000);

    cy.contains('a', 'Modules')
      .should('be.visible')
      .click();
    cy.wait(1000);

    cy.ensureModuleChecked('Members');
    cy.wait(500);

    cy.ensureModuleChecked('Voters Role');
    cy.wait(500);

    cy.ensureModuleChecked('Waiting Room');
    cy.wait(500);

  });

});