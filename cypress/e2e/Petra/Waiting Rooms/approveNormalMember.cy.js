let normalMemberFixture;

before(() => {
  cy.generateNormalMemberFixture().then((member) => {
    normalMemberFixture = member;
    cy.log(`Generated Normal Member: ${JSON.stringify(normalMemberFixture)}`);
  });
});

describe('Approve Normal Member from the Waiting Rooms', () => {
    beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('should impersonate a Provincial Admin', () => {
    cy.visit('/');
    cy.sideNav('Users', 'users/user');

    cy.get('input[type="search"]')
      .should('be.visible')
      .type('Ruben Test', { delay: 50 });

    cy.get('body').type('{enter}');
    cy.wait(1000);

    cy.contains('td', 'rubenpropay@gmail.com')
      .parents('tr')
      .within(() => {
        cy.get('button').first().click();
      });

    cy.contains('button', 'Impersonate')
      .should('be.visible')
      .click();

    cy.wait(2000);

    cy.visit('/');
  });

  it.skip('should create a Normal Member while being impersonated as a Provincial Admin', () => {
    
  });
  
});