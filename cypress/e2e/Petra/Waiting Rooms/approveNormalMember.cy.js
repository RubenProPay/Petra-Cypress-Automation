let normalMemberFixture;

before(() => {
    cy.generateNormalMemberFixture().then((member) => {
        normalMemberFixture = member;
        cy.log(`Generated Normal Member: ${JSON.stringify(normalMemberFixture)}`);
        cy.writeFile('cypress/fixtures/normalMemberApproval.json', normalMemberFixture);
    });
});

describe('Approve Normal Member from the Waiting Rooms', () => {
    beforeEach(() => {
        cy.loginRoot();
        cy.wait(1000);
    });

    it('should impersonate a Provincial Admin', () => {
        cy.visit('/');
        cy.wait(1000);
        cy.sideNav('Users', 'users/user');

        cy.get('input[type="search"]')
            .should('be.visible')
            .type('Ruben Test', { delay: 50 });

        cy.get('body').type('{enter}');
        cy.wait(1000);

        cy.contains('td', 'rubenpropay@gmail.com')
            .parents('tr')
            .within(() => {
                cy.get('button').first().click();
            });

        cy.contains('button', 'Impersonate')
            .should('be.visible')
            .click();

        cy.wait(2000);
    });

    it('should create a Normal Member while being impersonated as a Provincial Admin', () => {
        cy.visit('/members/create');
        cy.wait(1000);
        cy.get('input[id="verify_id_number"]').should('be.visible').type(normalMemberFixture.id_number);
        cy.contains('button', 'Verify with IEC').should('be.visible').click();
        cy.wait(3000);
        cy.contains('button', 'Create Member').should('be.visible').click();
        cy.wait(1000);
        cy.dropdown('member_type_id', 'Contact type *', normalMemberFixture.member_type, { clear: true });
        cy.get('input[id="firstname"]').type(normalMemberFixture.firstname);
        cy.get('input[id="surname"]').type(normalMemberFixture.surname);
        cy.dropdown('title_id', 'Title', normalMemberFixture.title, { clear: true });
        cy.dropdown('gender_id', 'Gender', normalMemberFixture.gender, { clear: true });
        cy.dropdown('language_id', 'Language', normalMemberFixture.language, { clear: true });
        cy.get('input[id="cell"]').type(normalMemberFixture.cellphone);
        cy.get('input[id="email"]').type(normalMemberFixture.email);
        cy.get('input[id="address2"]').type(normalMemberFixture.address.address2);
        cy.get('input[id="address3"]').type(normalMemberFixture.address.address3);
        cy.get('input[id="address4"]').type(normalMemberFixture.address.address4);
        cy.get('input[id="address5"]').type(normalMemberFixture.address.address5);
        cy.searchableDropdownMC('province_id', 'Province', normalMemberFixture.address.province);
        cy.get('button:visible')
            .filter((i, el) => Cypress.$(el).text().trim() === 'Save')
            .first()
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
    });

});