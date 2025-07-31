import 'cypress-xpath';
import 'cypress-file-upload';

// Logs in as root user Cypress
Cypress.Commands.add("loginRoot", () => {
  const sessionId = `user-session-cypress`;

  cy.session(sessionId, () => {
    cy.visit("/login");
    cy.get("input[name='email']", { timeout: 6000 }).should('be.visible').type("propaycypressautomation@gmail.com");
    cy.get("input[name='password']").type("ElongatedMango1103");
    cy.get("button[type='submit']").click();
    cy.url().should("not.include", "/login");
  }, {
    cacheAcrossSpecs: true
  });
});

Cypress.Commands.add("loginRootRuben", () => {
  const sessionId = `user-session-ruben`;

  cy.session(sessionId, () => {
    cy.visit("https://vfplus.datakrag.co.za/login");
    cy.get("input[name='email']", { timeout: 6000 }).should('be.visible').type("ruben.dasilva@propaysystems.com");
    cy.get("input[name='password']").type("YWZNxJepZPd7kiq!");
    cy.get("button[type='submit']").click();
    cy.url().should("not.include", "/login");
  }, {
    cacheAcrossSpecs: true
  });
});

// logs in as user
Cypress.Commands.add("loginUser", () => {
  cy.session("user-session", () => {
    cy.visit("/login");
    cy.get("input[name='email']").type("rubenpropay@gmail.com");
    cy.get("input[name='password']").type("ElongatedMango1103");
    cy.get("button[type='submit']").click();
    cy.url().should("not.include", "/login");
  },
  {
    cacheAcrossSpecs: true
  });
});