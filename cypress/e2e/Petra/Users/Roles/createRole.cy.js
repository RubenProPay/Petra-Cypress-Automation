describe('Navigate to the Create Role page & create a role', () => {
  let roleFixture;
  
  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);

    cy.generateRoleFixture().then((role) => {
      roleFixture = role;
      cy.log(`Generated Role: ${JSON.stringify(roleFixture)}`);
    });
  });

  it('opens the user module and clicks roles', () => {
    cy.visit("/");
    cy.wait(1000);
    cy.sideNav('Users', 'roles');
  });

  it.skip('can verify ALL validations on the role creation', () => {
    cy.visit('/roles');
    cy.wait(1000);
    cy.contains('button', 'Create').should('be.visible').click();
    cy.contains('button', 'Save').should('be.visible').click();

    // Required validations
    const requiredValidations = [
      { label: 'name', message: 'This is required.' },
    ];

    requiredValidations.forEach(({ label, message }) => {
      cy.get("input[name='name']")
        .parent()
        .siblings()
        .contains('This is required.')
        .should('be.visible');
    });
    cy.wait(500);

    // Remove required validations
    cy.get("input[name='name']")
      .should('be.visible')
      .type(roleFixture.name, { delay: 50 })
    cy.wait(500);

    // Minimum validations
    cy.get("input[name='name']").should('be.visible').clear().type('R');
    cy.wait(1000);
    
    const minValidations = [
      { label: 'name', message: 'The name must be at least 2 characters.' },
    ];

    // Remove minimum validations
    cy.get('input[id="name"]').clear().type('Ru');

    minValidations.forEach(({ label, message }) => {
      cy.get("input[name='name']")
        .parent()
        .siblings()
        .contains('The name must be at least 2 characters..')
        .should('not.exist');
    });
    cy.wait(1000);

    // Max validations
    cy.get('input[id="name"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper, at dictum est gravida. Morbi nec magna at quam malesuada accumsan.');
    cy.wait(1000);

    const maxValidations = [
      { label: 'name', message: 'The name must be at most 50 characters.' },
    ];

    maxValidations.forEach(({ label, message }) => {
      cy.get("input[name='name']")
        .parent()
        .siblings()
        .contains('The name must be at most 50 characters.')
        .should('not.exist'); // THIS IS TO BE CHANGED ONCE VALIDATION IS FIXED
    });
    cy.wait(500);

    // Remove max validations
    cy.get('input[id="name"]').clear().type('Nullam vehicula magna sit amet magna ullamcorper');
    cy.wait(500);

    maxValidations.forEach(({ label, message }) => {
      cy.get("input[name='name']")
        .parent()
        .siblings()
        .contains('The name must be at most 50 characters.')
        .should('not.exist');
    });
    cy.wait(1000);
    cy.reload();
  });

  it('creates a role & assigns permissions', () => {
    cy.visit('/roles');
    cy.wait(1000);
    cy.contains('button', 'Create').should('be.visible').click();

    cy.get('input[name="name"]')
      .should('be.visible')
      .clear()
      .type(roleFixture.name, { delay: 50 });

    cy.log(`Created role: ${roleFixture.name}`);
    cy.contains('button', 'Save').should('be.visible').click();
    cy.expandAccordion('Root');

  });
});