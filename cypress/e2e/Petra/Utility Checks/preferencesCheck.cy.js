describe('Preferences Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it('checks if the modules/preferences are toggled on', () => {
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

    cy.selectActiveMemberType();
    cy.wait(1000);

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
