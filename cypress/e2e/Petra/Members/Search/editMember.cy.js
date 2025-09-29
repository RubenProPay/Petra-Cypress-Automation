describe('Navigate to a Member & edit', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('edits a member to new values', () => {
    cy.visit('/');
    cy.sideNav('Members', 'members/member');
    cy.wait(2000);

    cy.contains('td', '2208007588')
      .parents('tr')
      .within(() => {
        cy.contains('a', '2208007588').click({ force: true });
      });

    cy.contains('a', 'Personal Details').should('be.visible');
    cy.wait(1000);

    // Edit fields to new values
    cy.get('input[id="id_number"]').should('be.visible').clear().type('0707212569081');
    cy.get('input[id="firstname"]').should('be.visible').clear().type('CypressTest');
    cy.get('input[id="surname"]').should('be.visible').clear().type('CypressTest');
    cy.dropdown('title_id', 'Title', 'Adv.', { clear: true });
    cy.dropdown('gender_id', 'Gender', 'Female', { clear: true });
    cy.dropdown('language_id', 'Language', 'English', { clear: true });
    cy.get('input[id="cell"]').should('be.visible').clear().type('0849875656');
    cy.get('input[id="email"]').should('be.visible').clear().type('cypress@test.com');

    cy.get('button:contains("Save")')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    cy.wait(1000);
  });

  it('restores the member to original values', () => {
    cy.visit('/');
    cy.sideNav('Members', 'members/member');
    cy.wait(2000);

    cy.contains('td', '2208007588')
      .parents('tr')
      .within(() => {
        cy.contains('a', '2208007588').click({ force: true });
      });

    cy.contains('a', 'Personal Details').should('be.visible');
    cy.wait(1000);

    // Change fields back to original values
    cy.get('input[id="id_number"]').should('be.visible').clear().type('8706225138084');
    cy.get('input[id="firstname"]').should('be.visible').clear().type('Aubrey Steven');
    cy.get('input[id="surname"]').should('be.visible').clear().type('Aarloo');
    cy.dropdown('title_id', 'Title', 'Mr.', { clear: true });
    cy.dropdown('gender_id', 'Gender', 'Male', { clear: true });
    cy.dropdown('language_id', 'Language', 'Afrikaans', { clear: true });
    cy.get('input[id="cell"]').should('be.visible').clear().type('0796962717');
    cy.get('input[id="email"]').should('be.visible').clear().type('Aaarloo@vodamail.co.za');

    cy.get('button:contains("Save")')
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
    cy.wait(1000);
  });
});