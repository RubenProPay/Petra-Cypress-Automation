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

describe('Navigate to Create Member Page & Create a Member', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it.skip('opens the members module and clicks create', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.sideNav('Members', 'members/create');
  });

  it('checks that the IEC page is displaying and able to verify an ID number', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.sideNav('Members', 'members/create');
    cy.get('input[id="verify_id_number"]').should('be.visible').type(memberFixture.id_number);
    cy.wait(1000);
    cy.contains('button', 'Verify with IEC').should('be.visible').click();
    cy.wait(4000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);
  });


  it.skip('can create a member', () => {
    cy.visit('/members/create');
    cy.wait(1000);
    cy.get('input[id="id_number"]').should('be.visible').type(memberFixture.id_number);
    cy.dropdown('member_type', 'Member Type', memberFixture.member_type, { clear: true });
    cy.get('input[id="first_name"]').type(memberFixture.first_name);
    cy.get('input[id="surname"]').type(memberFixture.surname);
    cy.dropdown('title', 'Title', memberFixture.title, { clear: true });
    cy.dropdown('gender', 'Gender', memberFixture.gender, { clear: true });
    cy.dropdown('language', 'Language', memberFixture.language, { clear: true });
    cy.get('input[id="cellphone"]').type(memberFixture.cellphone);
    cy.get('input[id="email"]').type(memberFixture.email);
    cy.get('input[id="street"]').type(memberFixture.address.street);
    cy.get('input[id="suburb"]').type(memberFixture.address.suburb);
    cy.get('input[id="city"]').type(memberFixture.address.city);
    cy.get('input[id="code"]').type(memberFixture.address.code);
    cy.dropdown('province', 'Province', memberFixture.address.province, { clear: true });
    cy.contains('button', 'Submit').should('be.visible').click();
  });
});
