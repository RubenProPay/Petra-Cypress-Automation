let memberFixture;

before(() => {
  cy.generateMemberFixture().then((member) => {
    cy.generateSAID().then((id_number) => {
      member.id_number = id_number;
      cy.generateSACellphone().then((cellphone) => {
        member.cellphone = cellphone;
        memberFixture = member;
        cy.log(`Generated Member: ${JSON.stringify(memberFixture)}`);
      });
    });
  });
});

describe('Navigate to My Drafts Page & Discard a Draft Member', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('can save a draft member', () => {
    cy.visit('/members/create');
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);
    cy.get('input[id="id_number"]').should('be.visible').type(memberFixture.id_number);
    cy.dropdown('member_type_id', 'Contact type *', memberFixture.member_type, { clear: true });
    cy.get('input[id="firstname"]').type(memberFixture.firstname);
    cy.get('input[id="surname"]').type(memberFixture.surname);
    cy.dropdown('title_id', 'Title', memberFixture.title, { clear: true });
    cy.dropdown('gender_id', 'Gender', memberFixture.gender, { clear: true });
    cy.dropdown('language_id', 'Language', memberFixture.language, { clear: true });
    cy.get('input[id="cell"]').type(memberFixture.cellphone);
    cy.get('input[id="email"]').type(memberFixture.email);
    cy.get('input[id="address2"]').type(memberFixture.address.address2);
    cy.get('input[id="address3"]').type(memberFixture.address.address3);
    cy.get('input[id="address4"]').type(memberFixture.address.address4);
    cy.get('input[id="address5"]').type(memberFixture.address.address5);
    cy.searchableDropdownMC('province_id', 'Province', memberFixture.address.province);
    cy.get('button:visible').filter((i, el) => Cypress.$(el).text().trim() === 'Save Draft').first().scrollIntoView().should('be.visible').click({ force: true });
  });

  it('can confirms the draft member exists in My Drafts', () => {
    cy.visit('/members/my-drafts');
    cy.wait(2000);
    cy.get('input[type="search"]').should('be.visible').type(memberFixture.id_number, { delay: 50 });
    cy.get('body').type('{enter}');
    cy.wait(3000);
    
    cy.contains('td', memberFixture.id_number)
      .parents('tr')
      .within(() => {
        cy.get('.fi-icon-btn').click({ force: true }); 
        cy.contains('span', 'Edit').click({ force: true });
      });

    cy.wait(750);
    cy.contains('a', 'Personal Details').should('be.visible');
    cy.get('input[id="id_number"]').should('have.value', memberFixture.id_number);
    cy.get('input[id="firstname"]').should('have.value', memberFixture.firstname);
    cy.get('input[id="surname"]').should('have.value', memberFixture.surname);
    cy.get('input[id="cell"]').should('have.value', memberFixture.cellphone);
    cy.get('input[id="email"]').should('have.value', memberFixture.email);
    cy.wait(500);
  });

  it('can find and discard the draft member', () => {
    cy.visit('/members/my-drafts');
    cy.wait(2000);
    cy.get('input[type="search"]').should('be.visible').type(memberFixture.id_number, { delay: 50 });
    cy.get('body').type('{enter}');
    cy.wait(3000);
    
    cy.contains('td', memberFixture.id_number)
      .parents('tr')
      .within(() => {
        cy.get('.fi-icon-btn').click({ force: true }); 
        cy.contains('span', 'Edit').click({ force: true });
      });

    cy.contains('a', 'Personal Details').should('be.visible');
    cy.get('input[id="id_number"]').should('have.value', memberFixture.id_number);
    cy.get('input[id="firstname"]').should('have.value', memberFixture.firstname);
    cy.get('input[id="surname"]').should('have.value', memberFixture.surname);
    cy.get('input[id="cell"]').should('have.value', memberFixture.cellphone);
    cy.get('input[id="email"]').should('have.value', memberFixture.email);
    cy.wait(500);

    cy.contains('button', 'Discard').scrollIntoView().should('be.visible').click( { force: true });
    cy.wait(500);
    cy.get('button:visible').filter((i, el) => Cypress.$(el).text().trim() === 'Yes, Delete!').first().should('be.visible').click({ force: true });
    cy.wait(500);
  });
});
