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

  it('opens the members module and clicks create', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.sideNav('Members', 'members/create');
  });

  it('checks that the IEC page is displaying', () => {
    cy.visit('/');
    // cy.wait(1000);
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
        cy.reload();
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
    cy.get('input[id="firstname"]').clear().type('Ruben');
    cy.get('input[id="surname"]').clear().type('Da Silva');
    cy.get('input[id="cell"]').clear().type(memberFixture.cellphone);
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });
    cy.wait(500);

    minValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('not.exist');
        });
    });

    cy.wait(1000);
    cy.reload();
    // cy.wait(1000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);

    // Max validations
    cy.get('input[id="firstname"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper, at dictum est gravida. Morbi nec magna at quam malesuada accumsan.');
    cy.get('input[id="surname"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper, at dictum est gravida. Morbi nec magna at quam malesuada accumsan.');
    cy.get('input[id="initials"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper, at dictum est gravida. Morbi nec magna at quam malesuada accumsan.');
    cy.get('input[id="email"]').clear().type('NullamehiculamagnasitametmagnullamcorperatdictumestgravidaMorbinecmagnaatquammalesuadaaccumsan@gmail.com');
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });

    const maxValidations = [
      { label: 'firstname', message: 'A maximum of 50 letters is valid.' },
      { label: 'surname', message: 'A maximum of 50 letters is valid.' },
      { label: 'initials', message: 'The initials may not be greater than 10 characters.' },
      { label: 'email', message: 'The email may not be greater than 100 characters.' },
    ];
    
    maxValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('exist');
        });
    });

    // Remove max validations
    cy.get('input[id="firstname"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper.');
    cy.get('input[id="surname"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper.');
    cy.get('input[id="initials"]').clear().type('Nullam.');
    cy.get('input[id="email"]').clear().type('Nullamehiculamagnasitametmagnullam@gmail.com');
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });
    cy.wait(500);

    maxValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('not.exist');
        });
    });

    cy.wait(1000);
    cy.reload();
    // cy.wait(1000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);

    // Valid value validations
    cy.get('input[id="id_number"]').should('be.visible').type('1212127890123');
    cy.get('input[id="cell"]').scrollIntoView().should('be.visible').type('0000000000');
    cy.get('input[id="email"]').scrollIntoView().should('be.visible').type('QuamMalesuadaAccumsan1234567');
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });
    cy.wait(500);

    const validValueValidations = [
      { label: 'id_number', message: 'The id number is not a valid ID number.' },
            { label: 'cell', message: 'The cellphone must be a valid cellphone number in the format: 2782xxxxxxx or 082xxxxxxx.' },
      { label: 'email', message: 'The email must be a valid email address.' }
    ];

    validValueValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('exist');
        });
    });

    // Remove valid value validations
    cy.get('input[id="id_number"]').clear().type('9311177311083');
    cy.get('input[id="cell"]').clear().type(memberFixture.cellphone);
    cy.get('input[id="email"]').clear().type(memberFixture.email);
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });
    cy.wait(500);

    validValueValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('not.exist');
        });
    });

    cy.wait(1000);
    cy.reload();
    // cy.wait(1000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);

    // Unique validations
    cy.get('input[id="id_number"]').scrollIntoView().clear().type('8706225138084');
    // should also apply for member cell when dev has fixed it
    cy.get('input[id="email"]').scrollIntoView().clear().type('Aaarloo@vodamail.co.za');
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });
    cy.wait(1000);

    const uniqueValidations = [
      { label: 'id_number', message: 'The id number has already been taken.' },
      // include label for cell number when dev has fixed it
      { label: 'email', message: 'The email has already been taken.' },
    ];

    uniqueValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('exist');
        });
    });

    // Remove unique validations
    cy.get('input[id="id_number"]').scrollIntoView().clear().type(memberFixture.id_number);
    cy.get('input[id="email"]').scrollIntoView().clear().type(memberFixture.email);
    cy.contains('button', 'Save').scrollIntoView().should('be.visible').click( { force: true });
    cy.wait(500);

    uniqueValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('not.exist');
        });
    });
  });

  it('can create a member', () => {
    cy.visit('/members/create');
    cy.wait(1000);
    cy.get('input[id="verify_id_number"]').should('be.visible').type(memberFixture.id_number);
    cy.contains('button', 'Verify with IEC').should('be.visible').click();
    cy.wait(3000);
    cy.contains('button', 'Create Member').should('be.visible').click();
    cy.wait(1000);
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
    cy.get('button:visible').filter((i, el) => Cypress.$(el).text().trim() === 'Save').first().scrollIntoView().should('be.visible').click({ force: true });
  });
});
