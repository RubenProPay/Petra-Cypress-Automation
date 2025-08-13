describe('Correct Member Type Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it('searches for a member on the system', () => {
    cy.fixture('membersearchtable').then((members) => {
      const member = members[Math.floor(Math.random() * members.length)];

      const searchableFields = [
        member["ID Number"],
        member["Cell phone number"],
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

      cy.contains('td', String(randomValue))
        .parents('tr')
        .within(() => {
          cy.contains('a', String(member["Member Number"])).click({ force: true });
        });

      cy.contains('a', 'Personal Details').should('be.visible');
      cy.wait(1000);
    });
  });
});