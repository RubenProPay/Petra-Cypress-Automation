describe('Navigate to User table and test search + columns', () => {
  const columnsToSkipByName = ['Progress'];

  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it.skip('Searches for a user', () => {
    cy.visit("/");
    cy.sideNav('Users', 'users/user');

    cy.get('input[type="search"]')
      .should('be.visible')
      .type('CypressTest', { delay: 50 });

    cy.get('body').type('{enter}');
    cy.wait(1000);
  });

  it.skip('Column Show/Hide', () => {
    cy.visit('/users/user');

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

  it.skip('Sorts all columns ascending and descending', () => {
    cy.visit('/users/user');
    cy.sortAndVerifyAllColumns(columnsToSkipByName);
  });

  it('Cycles through per page dropdown', () => {
    cy.visit('/users/user');
    cy.cyclePerPageOptions(1000);
  });

  it('Clicks the "Next" page button', () => {
    cy.visit('/users/user');
    cy.clickAllPaginationPages();
    cy.wait(1000);
  });

});
