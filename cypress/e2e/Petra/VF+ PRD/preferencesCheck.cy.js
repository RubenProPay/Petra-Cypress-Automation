describe('VF+ PRD Preferences Check', () => {
  beforeEach(() => {
    cy.intercept(
      'GET',
      'https://challenges.cloudflare.com/cdn-cgi/challenge-platform/**',
      {
        statusCode: 200,
        body: { success: true },
      }
    ).as('cloudflareChallenge');

    cy.visit('/');
    cy.wait('@cloudflareChallenge');
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type('ruben.dasilva@propaysystems.com');
    cy.get('input[name="password"]').type('YWZNxJepZPd7kiq!');
    cy.get('button[type="submit"]').first().click({ force: true });
    cy.wait(1000);
  });

  it('checks preferences on VF+ PRD site', () => {
    cy.sideNavPrd('Administration', 'global');
    cy.wait(1000);

    cy.contains('a', 'Modules').should('be.visible').click();
    cy.wait(1000);

    cy.ensureModuleChecked('Members');
    cy.wait(1000);

    cy.ensureModuleChecked('Reports');
    cy.wait(1000);

    cy.ensureModuleChecked('Voters Role');
    cy.wait(1000);

    cy.ensureModuleChecked('Waiting Room');
    cy.wait(1000);

    cy.contains('button', 'Save').should('be.visible').click();
    cy.wait(2000);
  });

  it('checks the settings on each module', () => {
    cy.sideNavPrd('Administration', 'global');
    cy.wait(1000);

    cy.contains('a', 'Modules').should('be.visible').click();
    cy.wait(1000);

    cy.clickModuleEditIcon('Members');
    cy.wait(1000);
    cy.ensureMemberTypesCheckboxChecked();
    cy.wait(1000);
    // TODO: Add step to clear multi-select dropdown, click, and search for "Active Member"
    cy.clickLastSaveButton();
    cy.wait(1000);

    cy.clickModuleEditIcon('Voters Role');
    cy.wait(1000);
    cy.ensureVotersRollCheckboxChecked();
    cy.wait(1000);
    cy.clickLastSaveButton();
    cy.wait(1000);

    cy.clickModuleEditIcon('Waiting Room');
    cy.wait(1000);
    cy.ensureWaitingRoomCheckboxChecked();
    cy.wait(1000);
    cy.clickLastSaveButton();
    cy.wait(1000);
  });
});
