import 'cypress-xpath';
import 'cypress-file-upload';

// Generate Member Fixture
Cypress.Commands.add('generateMemberFixture', () => {
  return cy.task('generateMember').then((member) => {
    return cy.generateSAID().then((id_number) => {
      member.id_number = id_number;
      return member;
    });
  });
});

// Expand side navigation
Cypress.Commands.add('sideNavExpand', (...labels) => {
  if (!labels.length) throw new Error('Provide at least one label');

  labels.slice(0, -1).forEach((label) => {
    cy.contains('span', label, { timeout: 10000 })
      .parents('button')
      .scrollIntoView()
      .click({ force: true });
  });

  const last = labels[labels.length - 1];
  cy.contains('a,button', last, { timeout: 10000 })
    .scrollIntoView()
    .click({ force: true });
});

// Side navigation (default)
Cypress.Commands.add('sideNav', (module, page) => {
  cy.contains('span', module)
    .parents('button')
    .scrollIntoView()
    .click({ force: true });
  cy.get(`a[href="${Cypress.config().baseUrl + page}"]`)
    .last()
    .scrollIntoView()
    .should('be.visible')
    .click();
  cy.url().should('eq', Cypress.config().baseUrl + page);
});

// Side navigation (prod / absolute URLs)
Cypress.Commands.add('sideNavPrd', (module, page) => {
  cy.contains('span', module)
    .parents('button')
    .scrollIntoView()
    .click({ force: true });

  const isAbsoluteUrl = page.startsWith('http');
  const targetHref = isAbsoluteUrl ? page : Cypress.config().baseUrl + page;

  cy.get(`a[href="${targetHref}"]`)
    .last()
    .scrollIntoView()
    .should('be.visible')
    .click();

  cy.url().should('eq', targetHref);
});

// Non-searchable dropdowns
Cypress.Commands.add('dropdown', (labelFor, labelText, item, options = { clear: false }) => {
  const container = cy.get(`div[form-wrapper="${labelFor}"]`);

  if (options.clear) {
    container
      .find('div[name="form.wrapper.container.append"]')
      .find('button')
      .first()
      .click({ force: true });
    cy.wait(500);
  }

  cy.contains('label', labelText)
    .should('be.visible')
    .click();

  cy.get('.max-h-80:visible')
    .first()
    .should('be.visible')
    .within(() => {
      if (item === '__select_first__') {
        cy.get('div')
          .filter(':visible')
          .first()
          .click({ force: true });
      } else {
        cy.contains('div', item)
          .should('exist')
          .click({ force: true });
      }
    });
});

// Searchable dropdowns (generic)
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

  cy.contains('label', labelText)
    .should('be.visible')
    .click({ force: true });

  cy.wait(200);

  cy.get('input[id="name"]').click({ force: true });

  cy.wait(300);

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

// Searchable dropdowns (Member Create)
Cypress.Commands.add('searchableDropdownMC', (labelFor, labelText, item, options = { clear: false }) => {
  const fullItemText = item;

  const container = cy.get(`div[form-wrapper="${labelFor}"]`);
  if (options.clear) {
    container.find('div[name="form.wrapper.container.append"]')
      .find('button')
      .first()
      .click({ force: true });
    cy.wait(300);
  }

  cy.contains('label', labelText)
    .should('be.visible')
    .click({ force: true });

  cy.wait(200);

  cy.get('input[id="firstname"]').click({ force: true });

  cy.wait(300);

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
  const languages = ['Afrikaans', 'English'];
  return languages[Math.floor(Math.random() * languages.length)];
});


// Table commands
Cypress.Commands.add('collectTableHeaders', () => {
  let headers = [];
  return cy.get('th[class*="fi-ta-header-cell"]')
    .each(($el) => {
    const text = $el.text().trim();
    if (text) headers.push(text);
    })
    .then(() => headers);
});

// Toggle all columns in the table
Cypress.Commands.add('toggleAllColumns', () => {
  cy.get('button[title="Toggle columns"]').click();
  cy.wait(500);

  cy.get('label[for] input[type="checkbox"]').each(($checkbox) => {
    cy.wait(300);
    if ($checkbox.prop('checked')) {
      cy.wrap($checkbox).click({ force: true });
    }
  });

  cy.wait(500);
  cy.get('body').click(0, 0);
  cy.wait(500);

  cy.get('button[title="Toggle columns"]').click();
  cy.wait(500);
  cy.get('label[for] input[type="checkbox"]').each(($checkbox) => {
    cy.wait(300);
    if (!$checkbox.prop('checked')) {
      cy.wrap($checkbox).click({ force: true });
    }
  });
});

// Verify all columns are visible in the table
Cypress.Commands.add('verifyAllColumnsVisible', (headers) => {
  headers.forEach((headerText) => {
    cy.contains('th', headerText).should('exist');
  });
});

// Sort and verify all columns in the table
Cypress.Commands.add('sortAndVerifyAllColumns', () => {
  const columnsToSkipByName = ['Progress', 'Actions', ''];

  cy.get('th[class*="fi-ta-header-cell"]').then(($headers) => {
    const total = $headers.length;
    for (let index = 0; index < total; index++) {
      const header = $headers.eq(index).text().trim();
      if (columnsToSkipByName.includes(header)) {
        cy.log(`Skipping column: '${header}' (index ${index})`);
        continue;
      }

      cy.get('th[class*="fi-ta-header-cell"]').eq(index).click();
  cy.wait(2000);
      cy.get('th[class*="fi-ta-header-cell"]').eq(index).click();
  cy.wait(2000);
    }
  });
});

// Cycle through per-page options in the table
Cypress.Commands.add('cyclePerPageOptions', (waitTime = 2000) => {
  const options = ['10', '25', '50', '100'];
  const cycle = [...options, ...options.slice(0, -1).reverse()]; // 10,25,50,100,50,25,10

  cy.get('div.fi-input-wrp')
    .contains('span', 'Per page')
    .closest('div.fi-input-wrp')
    .find('select')
    .scrollIntoView()
    .should('be.visible')
    .then($select => {
      cycle.forEach(option => {
        cy.wrap($select)
          .select(option)
          .should('have.value', option);
        cy.wait(waitTime);
      });
    });
});

// Click through a limited number of pagination pages
Cypress.Commands.add('clickAllPaginationPages', (maxPages = 10) => {
  let pageCount = 0;
  function clickNextIfExists() {
    if (pageCount >= maxPages) {
      cy.log(`Reached maxPages limit: ${maxPages}`);
      return;
    }
    cy.get('ol.fi-pagination-items').then($pagination => {
      const nextButton = $pagination.find('li[rel="next"] button');
      if (nextButton.length) {
        cy.window().then(win => {
          win.scrollTo(0, document.body.scrollHeight);
        });
        cy.wait(500);
        cy.wrap(nextButton)
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true })
          .wait(1500)
          .then(() => {
            pageCount++;
            clickNextIfExists();
          });
      } else {
        cy.log('No more pages.');
      }
    });
  }

  clickNextIfExists();
});