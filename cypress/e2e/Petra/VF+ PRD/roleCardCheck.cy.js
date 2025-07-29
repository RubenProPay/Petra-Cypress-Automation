describe('Correct Member Type Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it('checks if the role card appears for Create Member', () => {
    cy.sideNavPrd('Members', 'members/create');
    cy.wait(1000);
  });

  it('checks if the role card appears for Search Member', () => {
    cy.sideNavPrd('Members', 'members/member');
    cy.wait(3000);

  });

  it.skip('checks if the role card does not appear for a Member', () => {
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
  });
});