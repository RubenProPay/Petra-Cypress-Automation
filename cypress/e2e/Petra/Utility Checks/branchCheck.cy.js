describe('Dash Branch Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it.skip('checks if the dash branch exists in the Branch table', () => {
    cy.sideNavExpand('Administration', 'Sectors', 'Branches');
    cy.wait(500);
    // column sort
    cy.sortAndVerifyAllColumns();
    cy.wait(500);

    // global search
    cy.get('input[type="search"]').should('be.visible').type('--', { delay: 50 });
    cy.get('body').type('{enter}');
    cy.wait(1000);
    cy.get('button[wire\\:click="removeTableFilters"]').click({ force: true });
    cy.wait(1000);

    // filter builder search
    cy.contains('button', 'Filter').should('be.visible').click({ force: true });
    cy.wait(500);
    
    cy.contains('button', 'Add rule').should('be.visible').click({ force: true });
    cy.wait(500);
    
    cy.contains('span', 'Name').should('be.visible').click({ force: true });
    cy.wait(500);

    cy.get('input[type="text"]').should('be.visible').type('--', { delay: 50 });
    cy.wait(500);
    cy.get('input[type="search"]').should('be.visible').click();
    cy.wait(1000);
    cy.get('button[title="Delete"]').should('be.visible').click({ force: true });
    cy.wait(1000);
    });

    it('checks if the dash branch exists in the Members Search table', () => {
        cy.sideNav('Members', 'members/member');
        cy.wait(2000);

        cy.contains('button', 'Filter').should('be.visible').click({ force: true });
        cy.wait(500);
        
        cy.contains('button', 'Add rule').should('be.visible').click({ force: true });
        cy.wait(500);
        
        cy.contains('span', 'Branch').should('be.visible').click({ force: true });
        cy.wait(500);

        // cy.get('input[type="Search"]').should('be.visible').type('--', { delay: 50 });
        // cy.wait(500);

        // cy.get('button[title="Delete"]').should('be.visible').click({ force: true });
        // cy.wait(1000);
    });
});