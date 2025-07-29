describe('Correct Member Type Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it.skip('checks if the role card appears for Create Member', () => {
    cy.sideNavPrd('Members', 'members/create');
    cy.wait(1000);
  });

  it('checks if the role card appears for Search Member', () => {
    cy.fixture('activeMemberType').then((members) => {
      const member = members[Math.floor(Math.random() * members.length)];

      // Only use fields that exist in the fixture
      const searchableFields = [
        member["ID Number"],
        member["Cell phone number"],
        member["Name"],
        member["Surname"],
        member["Email"],
        member["Member Number"],
        member["Old Member No."]
      ].filter(Boolean);

      const randomValue =
        searchableFields[Math.floor(Math.random() * searchableFields.length)];

      cy.visit('/');
      cy.sideNav('Members', 'members/member');
      cy.wait(2000);

      cy.get('input[type="search"]')
        .should('be.visible')
        .type(String(randomValue), { delay: 50 });
      cy.get('body').type('{enter}');
      cy.wait(15000);

      // Click the hyperlink in the Member Number cell for the searched member
      cy.contains('td', String(randomValue))
        .parents('tr')
        .within(() => {
          cy.contains('a', String(member["Member Number"])).click({ force: true });
        });

      cy.contains('a', 'Personal Details').should('be.visible');
      cy.wait(1000);
    });
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