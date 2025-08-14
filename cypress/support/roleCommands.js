import 'cypress-xpath';
import 'cypress-file-upload';

const permissionMap = { 
  "Members": ['view', 'create', 'edit', 'delete', 'search', 'freeze', 'rejoin'],
  "Members-details": ['view', 'edit'],
  "Members-addresses": ['view', 'create', 'edit', 'delete'],
  "Members-products": ['view', 'create', 'edit', 'delete'],
  "Members-notes": ['view', 'create'],
  "Members-documents": ['view', 'create', 'delete'],
  "Members-communication": ['view'],
  "Members-audit": ['view'],
  "Waiting-rooms": ['view', 'edit'],
  "Tickets": ['view', 'create', 'edit', 'delete'],
  "Procomm": ['view', 'settings', 'approvers'],
  "Reports": ['view', 'create', 'edit', 'delete'],
  "Voters-roll": ['view', 'create', 'edit', 'delete', 'reports'],
  "Voters-options": ['view', 'create', 'edit', 'delete'],
  "Users": ['view', 'create', 'edit', 'delete', 'impersonate'],
  "User-security": ['view', 'edit'],
  "User-authentication-log": ['view'],
  "User-activities": ['view'],
  "User-call-center": ['edit'],
  "User-province": ['edit'],
  "Roles": ['view', 'create', 'edit', 'delete'],
  "Permissions": ['view', 'edit'],
  "Administration": ['view'],
  "Branches": ['view', 'create', 'edit', 'delete'],
  "Calendar": ['view', 'create'],
  "Notices": ['view', 'create', 'edit', 'delete'],
  "Member-roles": ['view', 'create', 'edit', 'delete'],
  "Member-role-levels": ['view', 'create', 'edit', 'delete'],
  "Member-role-categories": ['view', 'create', 'edit', 'delete'],
  "Member-role-groups": ['view', 'create', 'edit', 'delete'],
  "Member-join-date": ['edit'],
  "Genders": ['view', 'create', 'edit', 'delete'],
  "Occupations": ['view', 'create', 'edit', 'delete'],
  "Products": ['view', 'create', 'edit', 'delete'],
  "Product-types": ['view', 'create', 'edit', 'delete'],
  "Payment-methods": ['view', 'create', 'edit', 'delete'],
  "Tags": ['view', 'create', 'edit', 'delete'],
  "Note-types": ['view', 'create', 'edit', 'delete'],
  "Document-types": ['view', 'create', 'edit'],
  "Member-type": ['view', 'create', 'edit', 'delete'],
  "Product-settings": ['view', 'edit'],
  "Banking-details": ['view', 'edit', 'create', 'delete']
};

// Generating Role Fixture
Cypress.Commands.add('generateRoleFixture', () => {
  const roleFixture = {};

  const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  roleFixture.name = `CyRole-${randomSuffix}`;

  roleFixture.permissions = [];

  // Loop through each section and randomly pick some permissions
  Object.entries(permissionMap).forEach(([section, perms]) => {
    const selectedPerms = perms.filter(() => Math.random() < 0.3);
    selectedPerms.forEach(permission => {
      roleFixture.permissions.push({ section, permission });
    });
  });

  cy.log(`Generated role fixture: ${roleFixture.name}`);

  return cy.writeFile('cypress/fixtures/role.json', roleFixture).then(() => {
    return cy.wrap(roleFixture);
  });
});

// Accordion expand command
Cypress.Commands.add('expandAccordionInContainer', (label) => {
  cy.get('div.max-w-3xl.mx-auto.divide-y.divide-gray-200')
    .contains('span', label)
    .closest('button')
    .click({ force: true });
});

// Toggle permission in accordion
Cypress.Commands.add('togglePermissionInAccordion', (accordionLabel, ...permissions) => {
  cy.log(`Expanding accordion: ${accordionLabel}`);

  cy.get('div.max-w-3xl.mx-auto.divide-y.divide-gray-200')
    .contains('span', accordionLabel)
    .closest('button')
    .as('accordionButton')
    .scrollIntoView() // Ensure button is visible
    .click({ force: true });

  cy.wait(500);

  // Scope to the expanded accordion container
  cy.get('@accordionButton')
    .parent() 
    .next()   
    .within(() => {
      permissions.forEach(permissionLabel => {
        cy.get('label').each(($label) => {
          const labelText = $label.text().trim().toLowerCase();
          if (labelText === permissionLabel.toLowerCase()) {
            cy.wrap($label)
              .scrollIntoView() 
              .invoke('attr', 'for')
              .then((id) => {
                cy.get(`#${id}`)
                  .scrollIntoView() 
                  .then(($checkbox) => {
                    if ($checkbox.prop('checked')) {
                      cy.wrap($checkbox).uncheck({ force: true });
                    } else {
                      cy.wrap($checkbox).check({ force: true });
                    }
                  });
              });
          }
        });
      });
    });
});
