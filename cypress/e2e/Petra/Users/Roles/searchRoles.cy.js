describe('Navigate to Role table and test search + columns', () => {
  const columnsToSkipByName = ['Progress'];

  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('Searches for a role', () => {
    cy.visit("/");
    cy.sideNav('Users', 'roles');

    cy.get('input[type="search"]')
      .should('be.visible')
      .type('Cypress Test', { delay: 50 });

    cy.get('body').type('{enter}');
    cy.wait(1000);
  });

  it('Column Show/Hide', () => {
    cy.visit('roles');

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

  it('Sorts all columns ascending and descending', () => {
    cy.visit('roles');
    cy.sortAndVerifyAllColumns(columnsToSkipByName);
  });

  it('Cycles through per page dropdown', () => {
    cy.visit('roles');
    cy.cyclePerPageOptions(2000);
  });

  it('Clicks the "Next" page button', () => {
    cy.visit('roles');
    cy.clickAllPaginationPages();
    cy.wait(1000);
  });

});
