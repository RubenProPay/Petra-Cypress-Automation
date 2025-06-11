let userFixture;

before(() => {
  cy.generateUserFixture().then((user) => {
    userFixture = user;
    cy.log(`Generated User: ${JSON.stringify(userFixture)}`);
  });
});

describe('Navigate to Create User Page & Create a User', () => {
  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('opens the users module and clicks create', () => {
    cy.visit('/');
    cy.wait(1000);
    cy.sideNav('Users', 'users/user/create');
  });

  it('can verify ALL validations on the user creation', () => {
    cy.visit('users/user/create');
    cy.wait(1000);
    cy.contains('button', 'Submit').should('be.visible').click();

    // Required validations
    const requiredValidations = [
      { label: 'name', message: 'This is required.' },
      { label: 'surname', message: 'This is required.' },
      { label: 'id_number', message: 'This is required.' },
      { label: 'email', message: 'This is required.' },
      { label: 'cell', message: 'This is required.' },
      { label: 'language_id', message: 'This is required.' },
      { label: 'call_center_id', message: 'This is required.' },
    ];

    requiredValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('be.visible');
        });
    });

    cy.wait(1000);
    cy.reload();
    cy.wait(1000);

    // Minimum validations
    cy.get('input[id="name"]').should('be.visible').type('R');
    cy.get('input[id="surname"]').type('D');
    cy.get('input[id="id_number"]').type('9');
    cy.get('input[id="email"]').focus().blur();
    cy.get('input[id="cell"]').type('0');
    cy.wait(500);
    cy.get('div[form-wrapper="language_id"]').should('be.visible').click();
    cy.get('[index="1"] > .py-2').click();
    cy.get('.rounded-b-md').click();
    cy.wait(500);

    const minValidations = [
      { label: 'name', message: 'The name must be at least 2 characters.' },
      { label: 'surname', message: 'A minimum of 2 letters is required.' },
      { label: 'id_number', message: 'The id number must be at least 13 characters.' },
      { label: 'cell', message: 'The cellphone must be at least 10 characters.' },
    ];

    minValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('be.visible');
        });
    });

    // Remove minimum validations
    cy.get('input[id="name"]').clear().type('Ru');
    cy.get('input[id="surname"]').clear().type('Da');
    cy.get('input[id="id_number"]').clear().type('1234567890123');
    cy.get('input[id="email"]').focus().blur();
    cy.get('input[id="cell"]').clear().type('0810987654');
    cy.get('div[form-wrapper="language_id"]').click();
    cy.get('[index="0"] > .py-2').click();
    cy.get('.rounded-b-md').click();
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
    cy.wait(1000);

    // Max validations
    cy.get('input[id="name"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper, at dictum est gravida. Morbi nec magna at quam malesuada accumsan.');
    cy.get('input[id="surname"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper, at dictum est gravida. Morbi nec magna at quam malesuada accumsan.');
    cy.get('input[id="email"]').clear().type('NullamVehiculaMagnaSitAmetMagnaUllamcorperAtDictumEstGravidaMorbiNecMagnaaAtQuamMalesuadaAccumsan1234567@gmail.com');
    cy.get('div[form-wrapper="language_id"]').click();
    cy.get('[index="1"] > .py-2').click();
    cy.get('.rounded-b-md').click();
    cy.wait(500);

    const maxValidations = [
      { label: 'name', message: 'The name may not be greater than 50 characters.' },
      { label: 'surname', message: 'A maximum of 50 letters is valid.' },
      { label: 'email', message: 'The email may not be greater than 100 characters.' },
    ];

    maxValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('be.visible');
        });
    });

    // Remove max validations
    cy.get('input[id="name"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper.');
    cy.get('input[id="surname"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper.');
    cy.get('input[id="email"]').clear().type('QuamMalesuadaAccumsan1234567@gmail.com');
    cy.get('div[form-wrapper="language_id"]').click();
    cy.get('[index="0"] > .py-2').click();
    cy.get('.rounded-b-md').click();
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
    cy.wait(1000);

    // Valid value validations
    cy.get('input[id="id_number"]').type('1234567890123');
    cy.get('input[id="email"]').clear().type('QuamMalesuadaAccumsan1234567');
    cy.get('input[id="cell"]').type('0000000000');
    cy.get('div[form-wrapper="language_id"]').click();
    cy.get('[index="1"] > .py-2').click();
    cy.get('.rounded-b-md').click();
    cy.wait(500);

    const validValidations = [
      { label: 'id_number', message: 'The id number is not a valid ID number.' },
      { label: 'email', message: 'The email must be a valid email address.' },
      { label: 'cell', message: 'The cellphone must be a valid cellphone number in the format: 2782xxxxxxx or 082xxxxxxx.' },
    ];

    validValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('be.visible');
        });
    });

    // Remove valid value validations
    cy.get('input[id="id_number"]').clear().type('9311177311083');
    cy.get('input[id="email"]').clear().type('tyladare605@gmail.com');
    cy.get('input[id="cell"]').clear().type('0714123253');
    cy.get('div[form-wrapper="language_id"]').click();
    cy.get('[index="0"] > .py-2').click();
    cy.get('.rounded-b-md').click();
    cy.wait(500);

    validValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('not.exist');
        });
    });

    cy.wait(1000);
    cy.reload();
    cy.wait(1000);

    // Unique validations
    cy.get('input[id="id_number"]').type('9907065112085');
    cy.get('input[id="email"]').type('rubenpropay@gmail.com');
    cy.get('div[form-wrapper="language_id"]').click();
    cy.get('[index="0"] > .py-2').click();
    cy.get('.rounded-b-md').click();
    cy.wait(500);

    const uniqueValidations = [
      { label: 'email', message: 'The email has already been taken.' },
      { label: 'id_number', message: 'The id number has already been taken.' },
    ];

    uniqueValidations.forEach(({ label, message }) => {
      cy.get(`label[for='${label}']`)
        .last()
        .parent()
        .within(() => {
          cy.contains(message).should('be.visible');
        });
    });

    // Remove unique validations
    cy.get('input[id="id_number"]').clear().type('8307126738088');
    cy.get('input[id="email"]').clear().type('redate1310@ovobri.com');
    cy.get('div[form-wrapper="language_id"]').click();
    cy.get('[index="0"] > .py-2').click();
    cy.get('.rounded-b-md').click();
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

  it('can create a user', () => {
    cy.visit('/users/user/create');
    cy.wait(1000);
    cy.get('input[id="name"]').should('be.visible').type(userFixture.name);
    cy.get('input[id="surname"]').type(userFixture.surname);
    cy.get('input[id="id_number"]').type(userFixture.id_number);
    cy.get('input[id="email"]').type(userFixture.email);
    cy.get('input[id="cell"]').type(userFixture.cell);
    cy.dropdown('language_id', 'Language', userFixture.language, { clear: true });
    cy.dropdown('role', 'Role', userFixture.role, { clear: true });
    cy.selectCallCenterAndProvinces(userFixture);
    cy.get('input[id="name"]').click({ force: true });
    cy.contains('button', 'Submit').should('be.visible').click();
  });
});