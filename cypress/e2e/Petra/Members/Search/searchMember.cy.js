describe('Correct Member Type Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it.skip('searches for a member on the system', () => {
    cy.fixture('membersearchtable').then((members) => {
      const member = members[Math.floor(Math.random() * members.length)];

      // Exclude '--' values from being searched
      const searchableFields = [
        member["ID Number"],
        member["Cell phone number"],
        member["Email"],
        member["Member Number"],
        member["Old Member No."]
      ].filter((val) => val && val !== "--");

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

  it('shows/hides the columns', () => {
    cy.visit('members/member');

    cy.collectTableHeaders().then((headers) => {
      cy.toggleAllColumns();

      // Close menu and reopen to simulate real user behavior
      cy.get('body').click(0, 0);
      cy.wait(1000);
      cy.get('button[title="Toggle columns"]').click();
      cy.wait(500);

      cy.toggleAllColumns(true); // Restore
      cy.verifyAllColumnsVisible(headers);
    });
  });

  it('sorts all columns ascending and descending', () => {
    cy.visit('members/member');
    cy.sortAndVerifyAllColumns();
  });

  it('cycles through per page dropdown', () => {
    cy.visit('members/member');
    cy.cyclePerPageOptions(2000);
  });

  it('clicks the "Next" page button', () => {
    cy.visit('members/member');
    cy.clickAllPaginationPages();
    cy.wait(1000);
  });

});