import 'cypress-xpath';
import 'cypress-file-upload';

Cypress.Commands.add('branchDropdown', (labelFor, labelText, item, options = { clear: false }) => {
  const container = cy.get(`div[form-wrapper="${labelFor}"]`);

  if (options.clear) {
    container
      .find('div[name="form.wrapper.container.append"]')
      .find('button')
      .first()
      .click({ force: true });
    cy.wait(500);
  }

  // Open dropdown
  cy.contains('label', labelText)
    .should('be.visible')
    .click();

  cy.get('.max-h-80:visible')
    .first()
    .should('be.visible')
    .within(() => {
      if (item === '__select_first__') {
        // Click the very first visible option
        cy.get('li[tabindex="-1"], li[tabindex="0"]')
          .filter(':visible')
          .first()
          .find('div')
          .first()
          .click({ force: true });
      } else {
        cy.contains('div', item)
          .should('be.visible')
          .click({ force: true });
      }
    });
});
