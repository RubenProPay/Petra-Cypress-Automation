describe('Correct Member Type Check', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.visit('/');
    cy.wait(1000);
  });

  it('checks if the role card appears for Create Member', () => {
    cy.sideNavPrd('Members', 'members/create');
    cy.wait(1000);

    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);
    cy.contains('p', 'Update members role.').should('be.visible');
    cy.wait(500);

    cy.get('div.text-gray-400.col-span-4').contains('For role selection, please select a correct Member Type.').scrollIntoView().should('be.visible');
    cy.wait(500);

    cy.dropdown('member_type_id', 'Member type *', 'Active Member', { clear: true });
    cy.wait(500);

    cy.get('div.text-gray-400.col-span-4').contains('For role selection, please assign a branch to the member').should('be.visible');
    cy.wait(500);
    
    cy.contains('p', 'Update members address information.').should('be.visible');
    cy.dropdown('province_id', 'Province *', 'Gauteng', { clear: true });
    cy.wait(2000);
    cy.branchDropdown('branch_id', 'Member Branch', '__select_first__')

    cy.contains('label', 'TAK | BRANCH')
            .should('be.visible')
            .then(() => {
              cy.log('✅ Label "TAK | BRANCH" found — branch is correct');
            });

    cy.dropdown('member_type_id', 'Member type *', 'Normal Member', { clear: true });
    cy.wait(500);

    cy.get('div.text-gray-400.col-span-4').contains('For role selection, please select a correct Member Type.').scrollIntoView().should('be.visible');
    cy.wait(500);
  });

  it('searches for an active member (active) & checks the role card rules', () => {
    cy.fixture('activeMemberType').then((members) => {
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

          cy.wait(500);

          cy.get('#address2').clear().type('Test');
          cy.wait(500);
          cy.get('#address3').clear().type('Test');
          cy.wait(500);
          cy.get('#address4').clear().type('Test');
          cy.wait(500);
          cy.branchDropdown('branch_id', 'Member Branch', '__select_first__')
          cy.get('button[wire\\:click="submit"]').last().click();
          cy.wait(500);
          cy.contains('label', 'TAK | BRANCH')
            .should('be.visible')
            .then(() => {
              cy.log('✅ Label "TAK | BRANCH" found — branch is correct');
            });

        } else {
          cy.log('✅ Member has a branch — checking for "TAK | BRANCH" label');

          cy.contains('label', 'TAK | BRANCH')
            .should('be.visible')
            .then(() => {
              cy.log('✅ Label "TAK | BRANCH" found — branch is correct');
            });
        }
      });
    cy.visit('/');
    cy.wait(1000);
    });
  });

  it('searches for an any member (active) & checks the role card rules', () => {
    cy.fixture('membersearchtable').then((members) => {
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
        if ($body.text().includes('For role selection, please select a correct Member Type.')) {
          
          cy.dropdown('member_type_id', 'Member type *', 'Active Member', { clear: true });
          cy.wait(500);

          cy.contains('span', 'Member Branch')
            .closest('div')
            .parent()
            .siblings()
            .contains('button', 'Edit')
            .should('be.visible')
            .click({ force: true, multiple: true, timeout: 5000 });

          cy.wait(500);

          cy.get('#address2').clear().type('Test');
          cy.wait(500);
          cy.get('#address3').clear().type('Test');
          cy.wait(500);
          cy.get('#address4').clear().type('Test');
          cy.wait(500);
          cy.branchDropdown('branch_id', 'Member Branch', '__select_first__')
          cy.get('button[wire\\:click="submit"]').last().click();
          cy.wait(500);
          cy.contains('label', 'TAK | BRANCH')
            .should('be.visible')
            .then(() => {
              cy.log('✅ Label "TAK | BRANCH" found — branch is correct');
            });

        } else if ($body.text().includes('For role selection, please assign a branch to the member')) {
          cy.log('⚠️ Member is missing a branch — clicking Edit');
          cy.contains('span', 'Member Branch')
            .closest('div')
            .parent()
            .siblings()
            .contains('button', 'Edit')
            .should('be.visible')
            .click({ force: true, multiple: true, timeout: 5000 });

          cy.wait(500);
          cy.get('#address2').clear().type('Test');
          cy.wait(500); 
          cy.get('#address3').clear().type('Test');
          cy.wait(500);
          cy.get('#address4').clear().type('Test');
          cy.wait(500);
          cy.branchDropdown('branch_id', 'Member Branch', '__select_first__')
          cy.get('button[wire\\:click="submit"]').last().click();
          cy.wait(500);
        
        } else {
          cy.log('✅ Member has a branch — checking for "TAK | BRANCH" label');

          cy.contains('label', 'TAK | BRANCH')
            .should('be.visible')
            .then(() => {
              cy.log('✅ Label "TAK | BRANCH" found — branch is correct');
            });
        }
      });
    cy.visit('/');
    cy.wait(1000);
    });
  });
});
