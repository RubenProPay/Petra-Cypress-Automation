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

      cy.contains('td', 'cypresstestuser@propay.com')
      .parents('tr')
      .within(() => {
        cy.get('button').first().click(); // Click the action menu
      });
    
      cy.contains('button', 'Edit').click(); // Click "Edit"
      cy.wait(1000);

      cy.contains('a', 'Personal Details').should('be.visible');
      cy.wait(1000);

      cy.get('input[id="name"]').should('be.visible').clear().type('Hello Cypress');
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

      cy.get('button:contains("Save")')
        .first()
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

      cy.contains('Avatar').should('be.visible');
      cy.get('input[type="file"][accept="image/*"]') // Targets FilePond input
        .should('exist')
      .attachFile('ProfilePhoto.jpg');
      cy.wait(10000);

      cy.contains('Avatar')
        .parents('div') // walk up the tree
        .find('button')
        .contains('Save')
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });

      // cy.contains('a', 'Permissions').click();    
    
      // cy.fixture('editrole').then((roleFixture) => {
      //   roleFixture.permissions.forEach(({ section, permission }) => {
      //    cy.togglePermissionInAccordion(section, permission);
      //   });
      // });
      // cy.wait(1000);

      // cy.get('button:contains("Save")')
      //   .last()
      //   .scrollIntoView()
      //   .should('be.visible')
      //   .click({ force: true });

      cy.contains('a', 'Personal Details').click();
      cy.wait(1000);

      cy.get('input[id="name"]').should('be.visible').clear().type('CypressTestUser');
      cy.wait(1000);

      cy.get('input[id="surname"]').should('be.visible').clear().type('CypressTestUser');
      cy.wait(1000);

      cy.get('input[id="email"]').should('be.visible').clear().type('cypresstestuser@propay.com');
      cy.wait(1000);

      cy.get('button:contains("Save")')
        .first()
        .scrollIntoView()
        .should('be.visible')
        .click({ force: true });
    });
  });
  