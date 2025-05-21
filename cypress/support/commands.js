import 'cypress-xpath';

// Logs in as root user
Cypress.Commands.add("loginRoot", () => {
  const sessionId = `user-session-cypress`; // Add detail to make it unique if needed

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

// Side navigation
Cypress.Commands.add('sideNav', (module, page) => {
  cy.contains('span', module)
    .parents('button')
    .click({ force: true });
  cy.get(`a[href="${Cypress.config().baseUrl + page}"]`)
    .last()
    .should('be.visible')
    .click();
  cy.url().should('eq', Cypress.config().baseUrl + page);
});

//Non searchable dropdowns
Cypress.Commands.add('dropdown', (labelFor, labelText, item, options = { clear: false }) => {
  const fullItemText = item;

  const container = cy.get(`div[form-wrapper="${labelFor}"]`);

  if (options.clear) {
    container
      .find('div[name="form.wrapper.container.append"]')
      .find('button')
      .first()
      .click({force:true});
    cy.wait(500);
  }

  // Click to open dropdown
  cy.contains('label', labelText)
    .should('be.visible')
    .click();

  // Wait for dropdown to appear and interact with it
  cy.get('.max-h-80:visible')
  .first()
  .should('be.visible')
  .within(() => {
    cy.contains('div', fullItemText)
      .should('be.visible')
      .click({ force: true });
  });
});

// Searchable dropdowns (with input field inside)
Cypress.Commands.add('searchableDropdown', (labelFor, labelText, item, options = { clear: false }) => {
  const fullItemText = item;

  const container = cy.get(`div[form-wrapper="${labelFor}"]`);
  if (options.clear) {
    container.find('div[name="form.wrapper.container.append"]')
      .find('button')
      .first()
      .click({ force: true });
    cy.wait(300);
  }

  // First attempt to open dropdown
  cy.contains('label', labelText)
    .should('be.visible')
    .click({ force: true });

  cy.wait(200);

  // Click away to trigger stabilization (e.g. click the name input)
  cy.get('input[id="name"]').click({ force: true });

  cy.wait(300);

  // Re-click the dropdown to force Alpine to settle
  cy.contains('label', labelText)
    .click({ force: true });

  cy.get('.max-h-80:visible input[type="search"]', { timeout: 4000 })
    .should('be.visible')
    .click({ force: true })
    .clear()
    .type(fullItemText, { delay: 100, force: true });

  cy.contains('.max-h-80:visible div', fullItemText, { timeout: 6000 })
    .should('be.visible')
    .click({ force: true });

  cy.wait(300);
});

Cypress.Commands.add('selectCallCenterAndProvinces', (userFixture) => {
  const { role, call_center, province } = userFixture;

  // Select Call Center using stable logic
  cy.searchableDropdown('call_center_id', 'Call Center *', call_center, { clear: true });

  // Wait for Livewire to finish updating the provinces
  if (call_center === 'Head Office') {
    cy.wait(1000);
  }

  // If Head Office user, select ALL provinces using existing dropdown command
  if (role === 'National Admin (Head Office)' && call_center === 'Head Office') {
    const provinces = [
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
      'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
    ];

    provinces.forEach((prov, index) => {
      cy.searchableDropdown('province_ids', 'Province', prov);
    });

  } else {
    // Normal case: just select one province
    cy.searchableDropdown('province_ids', 'Province', province, { clear: true });
  }
});

// Creating a user on the system
Cypress.Commands.add('generateUserFixture', () => {
  const allProvinces = [
    'Eastern Cape',
    'Free State',
    'Gauteng',
    'International',
    'KwaZulu-Natal',
    'Limpopo',
    'Mpumalanga',
    'North West',
    'Northern Cape',
    'Unknown',
    'Western Cape'
  ];

  const roleToRegionMap = {
    'Eastern Cape Call Centre': 'Eastern Cape',
    'Free State Call Centre': 'Free State',
    'Gauteng Call Centre': 'Gauteng',
    'Kwazulu-Natal Call Centre': 'KwaZulu-Natal',
    'Limpopo Call Centre': 'Limpopo',
    'Mpumalanga Call Centre': 'Mpumalanga',
    'Northern Cape Call Centre': 'Northern Cape',
    'North West Call Centre': 'North West',
    'Western Cape Call Centre': 'Western Cape',
    'International Call Centre': 'International'
  };

  const roles = [
    'User (Viewer)',
    'Provincial Admin',
    'Data Capturer',
    'National Admin (Head Office)'
  ];

  const callCenters = Object.keys(roleToRegionMap);
  callCenters.push('Head Office');

  let userFixture = {};

  return cy.generateSAID().then((saId) => {
    userFixture.id_number = saId;

    return cy.generateSACellphone().then((cellphoneNumber) => {
      userFixture.cell = cellphoneNumber;

      return cy.generateLanguage().then((language) => {
        userFixture.language = language;

        return cy.task('generateUser').then((user) => {
          userFixture.name = user.name;
          userFixture.surname = user.surname;
          userFixture.email = user.email;

          // Assign a role
          const selectedRole = roles[Math.floor(Math.random() * roles.length)];
          userFixture.role = selectedRole;

          if (selectedRole === 'National Admin (Head Office)') {
            userFixture.call_center = 'Head Office';
            userFixture.provinces = allProvinces;
          } else {
            const entries = Object.entries(roleToRegionMap);
            const [callCenter, province] = entries[Math.floor(Math.random() * entries.length)];
            userFixture.call_center = callCenter;
            userFixture.province = province;
            userFixture.provinces = [province];
          }

          // Assertions for sanity check
          expect(userFixture.id_number).to.match(/^\d{13}$/);
          expect(userFixture.cell).to.match(/^0\d{9}$/);
          expect(['Afrikaans', 'English']).to.include(userFixture.language);
          expect(userFixture.name).to.be.a('string');
          expect(userFixture.surname).to.be.a('string');
          expect(userFixture.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

          // Debug logs
          cy.log(JSON.stringify(userFixture, null, 2));

          // Save to fixture file
          return cy.writeFile('cypress/fixtures/user.json', userFixture).then(() => {
            cy.log('User fixture has been written to user.json');
            return cy.wrap(userFixture);
          });
        });
      });
    });
  });
});


// Generating SA ID
Cypress.Commands.add('generateSAID', () => {
  const generateSAID = () => {
    const dateOfBirth = generateDateOfBirth();
    const gender = generateGender();
    const citizenship = generateCitizenship();
    const sequence = dateOfBirth + gender + citizenship + '8'; // Status is always 8 (default)
    const checksum = generateChecksum(sequence);

    return sequence + checksum; // Full 13-digit ID number
  };

  function generateDateOfBirth() {
    const year = String(Math.floor(Math.random() * (2005 - 1950 + 1)) + 1950).slice(2);
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // keep to 28 for simplicity

    return year + month + day;
  }

  function generateGender() {
    const num = Math.floor(Math.random() * 10000);
    return String(num).padStart(4, '0'); // 0000–9999
  }

  function generateCitizenship() {
    return Math.random() < 0.95 ? '0' : '1';
  }

  function generateChecksum(idWithoutChecksum) {
    let even = '';
    let oddSum = 0;

    for (let i = 0; i < idWithoutChecksum.length; i++) {
      const digit = parseInt(idWithoutChecksum.charAt(i));
      if ((i + 1) % 2 === 0) {
        even += digit;
      } else {
        oddSum += digit;
      }
    }

    let evenNum = String(parseInt(even) * 2);
    let evenSum = 0;
    for (let digit of evenNum) {
      evenSum += parseInt(digit);
    }

    const total = oddSum + evenSum;
    const checkDigit = (10 - (total % 10)) % 10;

    return String(checkDigit);
  }

  return generateSAID();
});

// Generating SA Cellphone
Cypress.Commands.add('generateSACellphone', () => {
  const generateSACellphone = () => {
    const carrierCode = generateCarrierCode();
    const randomNumber = generateRandomNumber();
    return carrierCode + randomNumber;
  };

  function generateCarrierCode() {
    const carrierCodes = ['083', '082', '081', '084', '078', '087', '076', '073'];
    const randomIndex = Math.floor(Math.random() * carrierCodes.length);
    return carrierCodes[randomIndex];
  }

  function generateRandomNumber() {
    return String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
  }

  return generateSACellphone();
});

// Generating Language
Cypress.Commands.add('generateLanguage', () => {
  const generateLanguage = () => {
    const languages = ['Afrikaans', 'English'];
    const randomIndex = Math.floor(Math.random() * languages.length);
    return languages[randomIndex];
  };

  return generateLanguage();
});

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
    const selectedPerms = perms.filter(() => Math.random() < 0.3); // ~30% chance to include each permission
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

  // Locate the specific accordion button
  cy.get('div.max-w-3xl.mx-auto.divide-y.divide-gray-200')
    .contains('span', accordionLabel)
    .closest('button')
    .as('accordionButton')
    .scrollIntoView() // Ensure button is visible
    .click({ force: true });

  // Wait for animation/render
  cy.wait(500);

  // Scope to the expanded accordion container
  cy.get('@accordionButton')
    .parent() // Get the accordion container
    .next()   // The content below the button
    .within(() => {
      // Loop over each permission provided
      permissions.forEach(permissionLabel => {
        cy.get('label').each(($label) => {
          const labelText = $label.text().trim().toLowerCase();
          if (labelText === permissionLabel.toLowerCase()) {
            cy.wrap($label)
              .scrollIntoView() // Ensure label is visible before interaction
              .invoke('attr', 'for')
              .then((id) => {
                cy.get(`#${id}`)
                  .scrollIntoView() // Ensure checkbox is visible
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

  // Optional: wait to allow visual verification before collapsing or moving on
  cy.wait(1000);
});
