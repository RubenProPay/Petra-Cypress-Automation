describe('VF+ PRD Preferences Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it.skip('checks preferences on VF+ PRD site', () => {
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

    cy.contains('label', 'Member Types')
      .should('have.attr', 'for')
      .then((forAttr) => {
        cy.contains('label', 'Member Types').click({ force: true });
        cy.wait(500);

        cy.get(`#${forAttr}`)
          .parents('div.relative')
          .find('div.wrapper-append-slot button')
          .then(($buttons) => {
            const clearButton = $buttons[0];
            if (clearButton) {
              cy.wrap(clearButton).invoke('show').click({ force: true });
              cy.wait(500);
            }
          });

        cy.contains('label', 'Member Types').click({ force: true });
        cy.wait(500);

        // Use a more specific selector for the dropdown option
        cy.get('ul[role="listbox"]:visible, ul:visible, .max-h-80:visible')
          .first()
          .should('be.visible')
          .within(() => {
            cy.contains('div', 'Active Member')
              .should('be.visible')
              .scrollIntoView()
              .click({ force: true });
          });

        cy.wait(500);
        cy.contains('label', 'Member Types').click({ force: true });
        cy.wait(500);
      });

    // Now click the save button
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
