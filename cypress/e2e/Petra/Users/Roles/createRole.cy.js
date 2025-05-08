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

  it('can verify ALL validations on the role creation', () => {
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

    // cy.wait(1000);
    // cy.reload();
    // cy.wait(1000);
  });

  // it('creates a role & assigns permissions', () => {
  //   cy.visit('/roles');
  //   cy.wait(1000);
  //   cy.contains('button', 'Create').should('be.visible').click();

  //   cy.get('input[name="name"]')
  //     .should('be.visible')
  //     .clear()
  //     .type(roleFixture.name, { delay: 50 });

  //   cy.log(`Created role: ${roleFixture.name}`);
  //   cy.contains('button', 'Save').should('be.visible').click();
  //   cy.wait(1000);    
  // });

});