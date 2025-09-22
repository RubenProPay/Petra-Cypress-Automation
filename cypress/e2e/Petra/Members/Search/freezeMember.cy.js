describe('Navigate and Freeze a Petra Member', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it('searches for a member and freezes', () => {
      cy.visit('/');
      cy.sideNav('Members', 'members/member');
      cy.wait(2000);

      cy.contains('td', '2208002541')
        .parents('tr')
        .within(() => {
          cy.contains('a', '2208002541').click({ force: true });
        });

      cy.contains('a', 'Personal Details').should('be.visible');
      cy.wait(1000);

      cy.get('button.rounded-l-none').click();
      cy.wait(500);

      cy.get('#btnFrozenSelect').scrollIntoView().click({ force: true });
      cy.wait(1000);

      cy.dropdown('cancellation_reason_id','Freeze Reason *', 'Terminated', {clear:true});
      cy.wait(250);

      cy.get('#note').should('be.visible').clear().type('Cypress test freeze member.', {delay:50});
      cy.wait(250);

      cy.get('button[wire\\:click="submit"]')
        .filter(':visible')
        .first()
        .click();
      cy.wait(2000);

    });

    it('searches for a member and unfreezes', () => {
      cy.visit('/');
      cy.sideNav('Members', 'members/member');
      cy.wait(2000);

      cy.contains('td', '2208002541')
        .parents('tr')
        .within(() => {
          cy.contains('a', '2208002541').click({ force: true });
        });

      cy.contains('a', 'Personal Details').should('be.visible');
      cy.wait(1000);

      cy.get('button.rounded-l-none').click();
      cy.wait(500);

      cy.contains('a', 'Rejoin')
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });

      cy.wait(500);

      cy.get('button:visible').filter((i, el) => Cypress.$(el).text().trim() === 'Yes, I confirm').first().should('be.visible').click({ force: true });
      cy.wait(500);

    });

});