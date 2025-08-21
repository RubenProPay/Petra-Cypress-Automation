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
    cy.wait(1000);
    cy.get('body').then(($body) => {
      if ($body.find('p:contains("Verify an ID number with the IEC.")').length > 0) {
        cy.wait(2000);
        // If visible, continue as normal
        cy.contains('p', 'Verify an ID number with the IEC.').should('be.visible');
      } else {
        cy.sideNavPrd('Administration', 'global');
        cy.wait(1000);
        cy.contains('a', 'Modules').should('be.visible').click();
        cy.wait(1000);
        cy.ensureModuleChecked('Voters Role');
        cy.wait(1000);
        cy.contains('button', 'Save').should('be.visible').click();
        cy.wait(2000);
        cy.visit('/');
        cy.wait(1000);
        cy.sideNavPrd('Administration', 'global');
        cy.wait(1000);
        cy.contains('a', 'Modules').should('be.visible').click();
        cy.wait(1000);
        cy.clickModuleEditIcon('Voters Role');
        cy.wait(1000);
        cy.ensureVotersRollCheckboxChecked();
        cy.wait(1000);
        cy.clickLastSaveButton();
        cy.wait(1000);
        cy.sideNav('Members', 'members/create');
        cy.contains('p', 'Verify an ID number with the IEC.').should('be.visible');
      }
    });
    cy.wait(500);
    cy.get('input[id="verify_id_number"]').should('be.visible').type(memberFixture.id_number);
    cy.wait(1000);
    cy.contains('button', 'Verify with IEC').should('be.visible').click();
    cy.wait(3000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);
  });

  it('can verify ALL validations on the member creation', () => {
    cy.visit('/members/create');
    cy.wait(1000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });

    // Required validations
    const requiredValidations = [
      { label: 'id_number', message: 'This is required.' },
      { label: 'member_type_id', message: 'This is required.' },
      { label: 'firstname', message: 'This is required.' },
      { label: 'surname', message: 'This is required.' },
      { label: 'title_id', message: 'This is required.' },
      { label: 'birth_date', message: 'This is required.' },
      { label: 'gender_id', message: 'This is required.' },
      { label: 'cell', message: 'Either cellphone number or email is required.' },
      { label: 'email', message: 'Either cellphone number or email is required.' },
      { label: 'address2', message: 'This is required.' },
      { label: 'address3', message: 'This is required.' },
      { label: 'address4', message: 'This is required.' },
      { label: 'province_id', message: 'This is required.' },
    ];

    requiredValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('exist');
        });
      // cy.wait(500);
    });

    cy.wait(1000);
    cy.reload();
    // cy.wait(1000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);

    // Minimum validations
    cy.get('input[id="firstname"]').scrollIntoView().should('be.visible').type('R');
    cy.get('input[id="surname"]').scrollIntoView().should('be.visible').type('D');
    cy.get('input[id="cell"]').scrollIntoView().should('be.visible').type('0');
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });

    cy.wait(500);

    const minValidations = [
      { label: 'firstname', message: 'A minimum of 2 letters is required.' },
      { label: 'surname', message: 'A minimum of 2 letters is required.' },
      { label: 'cell', message: 'The cellphone must be at least 10 characters.' },
    ];

    minValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('exist');
        });
    });

    // Remove minimum validations
    // cy.get('input[id="firstname"]').clear().type('Ruben');
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
