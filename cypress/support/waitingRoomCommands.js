import 'cypress-xpath';
import 'cypress-file-upload';

Cypress.Commands.add('generateNormalMemberFixture', () => {
  return cy.task('generateNormalMember').then((member) => {
    return cy.generateSAID().then((id_number) => {
      member.id_number = id_number;
      return cy.generateSACellphone().then((cellphone) => {
        member.cellphone = cellphone;
        return member;
      });
    });
  });
});