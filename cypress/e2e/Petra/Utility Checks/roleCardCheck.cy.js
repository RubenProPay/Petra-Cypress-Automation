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

  it('searches for an active member (active) & checks the role card', () => {
    cy.fixture('activeMemberType').then((members) => {
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

      cy.contains('a', 'Membership Details').should('be.visible').click();

      // todo: Add a check for the role card
    });
  });

  it.skip('checks if the role card does not appear for a Member', () => {
    cy.fixture('memberssearchtable').then((members) => {
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
        });
    });
});