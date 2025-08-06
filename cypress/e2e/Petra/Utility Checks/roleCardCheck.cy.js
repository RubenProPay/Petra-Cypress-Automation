describe('Correct Member Type Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
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

      cy.contains('p', 'Update members role.').should('be.visible');
      cy.contains('p', 'Update members branch.').should('be.visible');

      cy.get('body').then(($body) => {
        if ($body.text().includes('For role selection, please assign a branch to the member')) {
          cy.log('⚠️ Member is missing a branch — clicking Edit');

          cy.contains('span', 'Member Branch')
            .closest('div')
            .parent()
            .siblings()
            .contains('button', 'Edit')
            .should('be.visible')
            .click({ force: true, multiple: true, timeout: 5000 });

          // insert new logic here to select first item in branch dropdown
          cy.wait(500);

          cy.dropdown('branch_id', 'Member Branch', '__select_first__')

        } else {
          cy.log('✅ Member has a branch — checking for "TAK | BRANCH" label');

          cy.contains('label', 'TAK | BRANCH')
            .should('be.visible')
            .then(() => {
              cy.log('✅ Label "TAK | BRANCH" found — branch is correct');
            });
        }
      });
    });
  });
});
