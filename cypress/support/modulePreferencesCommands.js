import 'cypress-xpath';
import 'cypress-file-upload';

// Module preferences
Cypress.Commands.add('ensureModuleChecked', (moduleName) => {
  cy.contains('div.relative.flex.items-start.group', moduleName, { timeout: 10000 }) // find the outer wrapper that contains the module name
    .should('exist')
    .within(() => {
      cy.get('input[type="checkbox"]').then($checkbox => {
        if (!$checkbox.is(':checked')) {
          cy.wrap($checkbox).click({ force: true }); // check it only if not already checked
        }
      });
    });
});

// Module edit icon
Cypress.Commands.add('clickModuleEditIcon', (moduleName) => {
  cy.contains('div.relative.flex.items-start.group', moduleName)
    .should('exist')
    .within(() => {
      cy.get('svg[id$="_pencil"]') // matches any ID ending in _pencil
        .click({ force: true }); // override hidden state if needed
    });
});

// Module preference settings
Cypress.Commands.add('ensureMemberTypesCheckboxChecked', () => {
  cy.contains('label', 'Enable roles for the following member types:')
    .should('exist')
    .parents('div.relative.flex.items-start')
    .within(() => {
      cy.get('input[type="checkbox"]').then($checkbox => {
        if (!$checkbox.is(':checked')) {
          cy.wrap($checkbox).check({ force: true });
        }
      });
    });
});

// Voters Roll preference 
Cypress.Commands.add('ensureVotersRollCheckboxChecked', () => {
  const labels = [
    'Verify Member Before Create',
    'Edit IEC Voter Information on Voters Roll'
  ];

  labels.forEach(label => {
    cy.contains('label', label)
      .should('exist')
      .parents('div.relative.flex.items-start')
      .within(() => {
        cy.get('input[type="checkbox"]').then($checkbox => {
          if (!$checkbox.is(':checked')) {
            cy.wrap($checkbox).check({ force: true });
          }
        });
      });
  });
});

// Waiting Room preference
Cypress.Commands.add('ensureWaitingRoomCheckboxChecked', () => {
  const labels = [
    'Waiting room button layout',
    'Enable Member must be linked to a branch'
  ];

  labels.forEach(label => {
    cy.contains('label', label)
      .should('exist')
      .parents('div.relative.flex.items-start')
      .within(() => {
        cy.get('input[type="checkbox"]').then($checkbox => {
          if (!$checkbox.is(':checked')) {
            cy.wrap($checkbox).check({ force: true });
          }
        });
      });
  });
});

// Active Member Type selection
Cypress.Commands.add('selectActiveMemberType', () => {
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
});

// Preference modal save button
Cypress.Commands.add('clickLastSaveButton', () => {
  cy.get('div.border-t.rounded-b-md')
    .last()
    .should('be.visible')
    .within(() => {
      cy.contains('button', 'Save')
        .should('be.visible')
        .click({ force: true });
    });
});