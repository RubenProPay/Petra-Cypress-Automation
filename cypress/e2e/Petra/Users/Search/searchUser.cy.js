describe('Navigate to User table and test search + columns', () => {
  const columnsToSkipByName = ['Progress'];
  let headers = [];

  beforeEach(() => {
    cy.loginRoot();
    cy.wait(1000);
  });

  it('searches for a user', () => {
    cy.visit("/");
    cy.sideNav('Users', 'users/user');

    cy.get('input[type="search"]')
      .should('be.visible')
      .type('CypressTest', { delay: 50 });

    cy.get('body').type('{enter}');
    cy.wait(1000);
  });
  
  it('Column Show/Hide', () => {
  cy.visit('/users/user');

  let headers = [];

  // Step 1: Collect all visible table headers
  cy.get('th[class*="fi-ta-header-cell"]')
    .each(($el) => {
      const text = $el.text().trim();
      headers.push(text);
      expect(text, 'Header text should not be empty').to.not.be.empty;
    })
    .then(() => {
      cy.wrap(headers).as('tableHeaders');
    });

  // Step 2: Open the column toggle menu
  cy.get('button[title="Toggle columns"]').click();
  cy.wait(500);

  // Step 3: Uncheck all checkboxes to hide columns
  cy.get('label[for] input[type="checkbox"]').each(($checkbox, index, $list) => {
    cy.wait(300);
    if ($checkbox.prop('checked')) {
      cy.wrap($checkbox).click({ force: true });
    }
  });

  // Step 4: Close the menu
  cy.get('body').click(0, 0); // Click somewhere outside to close the dropdown
  cy.wait(1000);

  // Step 5: Reopen the menu
  cy.get('button[title="Toggle columns"]').click();
  cy.wait(500);

  // Step 6: Re-check all checkboxes
  cy.get('label[for] input[type="checkbox"]').each(($checkbox, index, $list) => {
    cy.wait(300);
    if (!$checkbox.prop('checked')) {
      cy.wrap($checkbox).click({ force: true });
    }
  });

  // Step 7: Validate headers are visible again
  cy.get('@tableHeaders').then((headers) => {
    headers.forEach((headerText) => {
      cy.contains('th', headerText).should('exist');
    });
  });
});


  it('Sorts all columns ascending and descending', () => {
    cy.visit('/users/user');

    cy.get('th[class*="fi-ta-header-cell"]')
      .each(($el) => {
        const text = $el.text().trim();
        expect(text).to.not.be.empty;
        headers.push(text);
      })
      .then(() => {
        headers.forEach((header, index) => {
          if (!columnsToSkipByName.includes(header)) {
            cy.then(() => sortColumnAndVerify(index, header));
          }
        });
      });

    const getColumnValues = (colIndex) => {
      return cy.get('tbody tr')
        .not(':first')
        .filter(':visible')
        .then($rows =>
          [...$rows].map(row => row.querySelectorAll('td')[colIndex]?.innerText.trim() || '')
        );
    };

    const inferType = (values) => {
      return values.every(v => !isNaN(parseFloat(v))) ? 'numeric' : 'text';
    };

    const sortColumnAndVerify = (colIndex, columnName = '') => {
      return getColumnValues(colIndex).then(initialValues => {
        const type = inferType(initialValues);
        const pretty = arr => arr.map(v => `"${v}"`).join(', ');

        const sortAsc = () => {
          cy.get(`th[class*="fi-ta-header-cell"]`).eq(colIndex).click();
          cy.wait(1000);
          return getColumnValues(colIndex).then(values => {
            const expected = [...values].sort((a, b) =>
              type === 'numeric' ? parseFloat(a) - parseFloat(b) : a.localeCompare(b)
            );
            expect(values, `Asc sort failed for "${columnName}":\n[${pretty(values)}] !== [${pretty(expected)}]`)
              .to.deep.equal(expected);
          });
        };

        const sortDesc = () => {
          cy.get(`th[class*="fi-ta-header-cell"]`).eq(colIndex).click();
          cy.wait(1000);
          return getColumnValues(colIndex).then(values => {
            const expected = [...values].sort((a, b) =>
              type === 'numeric' ? parseFloat(b) - parseFloat(a) : b.localeCompare(a)
            );
            expect(values, `Desc sort failed for "${columnName}":\n[${pretty(values)}] !== [${pretty(expected)}]`)
              .to.deep.equal(expected);
          });
        };

        return sortAsc().then(sortDesc);
      });
    };
  });
});
