let userFixture;
let currentLanguage;

before(() => {
  cy.fixture('user').then((user) => {
    userFixture = user;
    currentLanguage = user.language; // Track the current language
  });
});

describe('Navigate to a User & edit', () => {
    beforeEach(() => {
      cy.loginRoot();
      cy.wait(1000);
    });
  
    it('opens the users module and clicks edit on the a user', () => {
      cy.visit("/");
      cy.wait(1000);
      cy.sideNav('Users', 'users/user');

      cy.get('input[type="search"]')
        .should('be.visible')
        .type('CypressTest', { delay: 50 });

      cy.get('body').type('{enter}');

      cy.wait(1000);

      cy.contains('td', '@cypresstest.com')
      .parents('tr')
      .within(() => {
        cy.get('button').first().click(); 
      });
    
      cy.contains('button', 'Edit').click(); 
      cy.wait(1000);

      cy.contains('a', 'Personal Details').should('be.visible');
      cy.wait(1000);

      cy.get('input[id="name"]').should('be.visible').clear().type('Hello');
      cy.wait(1000);

      cy.get('input[id="surname"]').should('be.visible').clear().type('World');
      cy.wait(1000);

      cy.generateSAID().then((generatedSAID) => {
        cy.get('input[id="id_number"]').should('be.visible').clear().type(generatedSAID);
      });
      cy.wait(1000);

      cy.get('input[id="email"]').should('be.visible').clear().type('helloworld@cypresstest.com');
      cy.wait(1000);

      cy.generateSACellphone().then((generatedSACellphone) => {
        cy.get('input[id="cell"]').should('be.visible').clear().type(generatedSACellphone);
      });
      cy.wait(1000);

      cy.dropdown('status_id', 'Status', 'Frozen', { clear: true });
      cy.wait(1000);

      const oppositeLanguage1 = currentLanguage === 'English' ? 'Afrikaans' : 'English';
      cy.dropdown('language_id', 'Language', oppositeLanguage1, { clear: true });
      cy.wait(1000);
      currentLanguage = oppositeLanguage1; // Update after swap

      cy.get('button:contains("Save")')
        .first()
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

      cy.contains('Avatar').should('be.visible');
      cy.get('input[type="file"][accept="image/*"]')
        .should('exist')
      .attachFile('ProfilePhoto.jpg');
      cy.wait(5000);

      cy.contains('Avatar')
        .parentsUntil('form')     
        .parent()                  
        .first()                   
        .within(() => {
          cy.contains('button', 'Save')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
      });
      cy.wait(2000);

      cy.contains('a', 'Security').click();
      cy.wait(10000);

      cy.contains('a', 'Permissions').click();    
    
      cy.fixture('editrole').then((roleFixture) => {
        roleFixture.permissions.forEach(({ section, permission }) => {
         cy.togglePermissionInAccordion(section, permission);
        });
      });
      cy.wait(1000);

      cy.get('button:contains("Save")')
        .last()
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

      cy.wait(1000);  
      
      cy.contains('a', 'Personal Details').click();
      cy.wait(1000);

      cy.get('input[id="name"]').should('be.visible').clear().type('CypressTestUser');
      cy.wait(1000);

      cy.get('input[id="surname"]').should('be.visible').clear().type('CypressTestUser');
      cy.wait(1000);

      cy.get('input[id="email"]').should('be.visible').clear().type('cypresstestuser@cypresstest.com');
      cy.wait(1000);

      cy.dropdown('status_id', 'Status', 'Active', { clear: true });
      cy.wait(1000);

      const oppositeLanguage2 = currentLanguage === 'English' ? 'Afrikaans' : 'English';
      cy.dropdown('language_id', 'Language', oppositeLanguage2, { clear: true });
      cy.wait(1000);
      currentLanguage = oppositeLanguage2; // Update after swap

      cy.get('button:contains("Save")')
        .first()
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
      cy.wait(1000);

      cy.contains('Avatar')
        .parents('div')
        .find('button')
        .contains('Restore Default')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
      cy.wait(1000);

      cy.contains('button', 'Yes, Delete!')
        .should('be.visible')
        .click({ force: true });

    });
  });
