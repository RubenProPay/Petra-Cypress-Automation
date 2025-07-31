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
    cy.fixture('example').then((members) => {
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
      cy.wait(1000);

      cy.reload();
      cy.contains('p', 'Update members role.').should('be.visible');
      
      // add if block to check if the role card is visible based on the text "For role selection, please assign a branch to the member"
      cy.get('div.text-gray-400.col-span-4')
        .then(($el) => {
          const text = $el.text().trim();

          if (text.includes('For role selection, please assign a branch to the member')) {
            // If the warning is present, click the Edit button
                cy.contains('button', 'Edit').should('be.visible').click();
          } else {
            // If the warning is NOT present, check that the TAK | BRANCH label exists
            cy.contains('label.font-bold', 'TAK | BRANCH')
              .should('exist');
          }
        });
    });
  });

  it.skip('searches for any member & checks the role card', () => {
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