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

describe('Navigate to Create Member Page & Save a Draft Member', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('can create a draft member', () => {
    cy.visit('/members/create');
    // cy.wait(1000);
    // cy.get('input[id="verify_id_number"]').should('be.visible').type(memberFixture.id_number);
    // cy.contains('button', 'Verify with IEC').should('be.visible').click();
    // cy.wait(3000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);
    cy.get('input[id="verify_id_number"]').should('be.visible').type(memberFixture.id_number);
    cy.dropdown('member_type_id', 'Member type *', memberFixture.member_type, { clear: true });
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
});
