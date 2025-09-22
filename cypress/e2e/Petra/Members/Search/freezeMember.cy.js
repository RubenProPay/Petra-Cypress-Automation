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

      cy.get('input[type="search"]')
        .should('be.visible')
        .type('Aaarloo@vodamail.co.za', { delay: 50 });
      cy.get('body').type('{enter}');
      cy.wait(15000);

      cy.contains('td', '2208007588')
        .parents('tr')
        .within(() => {
          cy.contains('a', '2208007588').click({ force: true });
        });

      cy.contains('a', 'Personal Details').should('be.visible');
      cy.wait(1000);

      
    });

    it.skip('searches for a member and unfreezes', () => {
      cy.visit('/');
      cy.sideNav('Members', 'members/member');
      cy.wait(2000);

      cy.get('input[type="search"]')
        .should('be.visible')
        .type('Aaarloo@vodamail.co.za', { delay: 50 });
      cy.get('body').type('{enter}');
      cy.wait(15000);

      cy.contains('td', '2208007588')
        .parents('tr')
        .within(() => {
          cy.contains('a', '2208007588').click({ force: true });
        });

      cy.contains('a', 'Personal Details').should('be.visible');
      cy.wait(1000);
    });

});