it('Column Show/Hide', function () {
    cy.visit('/members/create');

    let headers = [];

    // Step 1: Collect all visible table headers
    cy.get('th[class*="fi-ta-header-cell"]')
      .each(($el) => {
        const text = $el.text().trim();
        headers.push(text);
        expect(text, 'Header text should not be empty').to.not.be.empty;
      })
      .then(() => {
        cy.log('Headers:', headers);
        cy.wrap(headers).as('tableHeaders');
      });

    // Step 2: Open the column toggle menu
    cy.get('button[title="Toggle columns"]').click();

    // Step 3: Ensure all checkboxes are checked before continuing
    cy.get('label[for] input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).then(($el) => {
        if (!$el.prop('checked')) {
          cy.wrap($el).click({ force: true });
        }
      });
    });

    // Step 4: Uncheck all checkboxes to hide the columns
    cy.get('label[for] input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).then(($el) => {
        if ($el.prop('checked')) {
          cy.wrap($el).click({ force: true });
        }
      });
    });

    // Step 5: Verify all headers are now gone
    cy.get('@tableHeaders').then((headers) => {
      headers.forEach((headerText) => {
        cy.contains('th', headerText).should('not.exist');
      });
    });

    // Optional: Re-check them again if you want to reset state for later tests
    cy.get('label[for] input[type="checkbox"]').each(($checkbox) => {
      cy.wrap($checkbox).then(($el) => {
        if (!$el.prop('checked')) {
          cy.wrap($el).click({ force: true });
        }
      });
    });
  });

it('Sorts all columns ascending and descending', () => {
    cy.visit('/members/create');

    const columnsToSkipByName = ['Progress'];
    let headers = [];

    // 1. Get headers and run sorting test 
    cy.get('th[class*="fi-ta-header-cell"]') // \ *= means contains 
      .each($el => {
        /* $el is a variable representing the current DOM element being iterated over.
        It comes from Cypress's .each() method, which is similar to JavaScript's Array.forEach()
          — but designed to iterate through a jQuery-like collection returned by cy.get(...).
        Important: $el is not a plain DOM node — it's a jQuery-wrapped element (like jQuery’s $(...) object),
          so you can call jQuery methods on it like .text(), .attr(), .find(), etc. */

        const text = $el.text().trim(); //Trim off the white spaces, tabs, ect.
        expect(text, 'Header text should not be empty').to.not.be.empty; headers.push(text);
      })
      .then(() => {
        cy.log('Testing sorting for all columns');
        headers.forEach((header, index) => {
          if (columnsToSkipByName.includes(header)) {
            cy.log(`Skipping column ${index}: ${header}`);
            return;
          }
          cy.then(() => {
            cy.log(`Sorting column ${index}: ${header}`);
            return sortColumnAndVerify(index, header);
          });
        });
      });


    // 2. Get all the values for a particular column
    const getColumnValues = (colIndex) => {
      return cy.get('tbody tr')
        .not(':first') // Skip search/filter row 
        .filter(':visible')// There are some random values that are not visiable on the fornt end that break the test
        .then($rows => {
          return [...$rows].map(row => {
            const cell = row.querySelectorAll('td')[colIndex];
            const text = cell?.innerText.trim() || '';
            return text;
          });
        });
    };

    //Some logic to determine if a column is numiric or text to pick a sorting type
    const inferType = (values) => { return values.every(v => !isNaN(parseFloat(v))) ? 'numeric' : 'text'; };

    const sortColumnAndVerify = (colIndex, columnName = '') => {
      return getColumnValues(colIndex).then(initialValues => {
        const type = inferType(initialValues);
        const pretty = arr => arr.map(v => `"${v}"`).join(', '); // helper function that makes arrays look better in the assertion error

        const sortAsc = () => {
          cy.get(`th[class*="fi-ta-header-cell"]`).eq(colIndex).click();
          cy.wait(1000);
          return getColumnValues(colIndex).then(values => {
            const expected = [...values].sort((a, b) => //create a shallow/temporary copy of the values array.
              type === 'numeric' ? parseFloat(a) - parseFloat(b) : a.localeCompare(b)
            );
            cy.log(`Ascending - Actual (${colIndex}): ${values}`);
            cy.log(`Ascending - Expected (${colIndex}): ${expected}`);
            expect(values, `Ascending sorting failed for column "${columnName}":\nActual: [${pretty(values)}]\nExpected: [${pretty(expected)}]`).to.deep.equal(expected);
          });
        };

        const sortDesc = () => {
          cy.get(`th[class*="fi-ta-header-cell"]`).eq(colIndex).click();
          cy.wait(1000);
          return getColumnValues(colIndex).then(values => {
            const expected = [...values].sort((a, b) =>
              type === 'numeric' ? parseFloat(b) - parseFloat(a) : b.localeCompare(a)
            );
            cy.log(`Descending - Actual (${colIndex}): ${values}`);
            cy.log(`Descending - Expected (${colIndex}): ${expected}`);
            expect(values, `Descending sorting failed for column "${columnName}":\nActual: [${pretty(values)}]\nExpected: [${pretty(expected)}]`).to.deep.equal(expected);
          });
        };

        return sortAsc().then(sortDesc);
      });
    };
  });

   it('Searches each column using an existing value and verifies filtering', () => {
    cy.visit('/members/create');
  
    const columnsToSkipByName = ['Progress'];
    let headers = [];
  
    // Step 1: Get all headers
    cy.get('th[class*="fi-ta-header-cell"]')
      .each($el => {
        const text = $el.text().trim();
        expect(text, 'Header text should not be empty').to.not.be.empty;
        headers.push(text);
      })
      .then(() => {
        cy.log('Testing column search inputs');
        let inputIndex = 0;
      
        headers.forEach((header, fullColIndex) => {
          if (columnsToSkipByName.includes(header)) {
            cy.log(`⏭️ Skipping column ${fullColIndex}: ${header}`);
            return;
          }
      
          searchColumn(fullColIndex, inputIndex, header);
          inputIndex++;
        });
      });
  
    // Helper: Get values from a column (excluding first row which is filter inputs)
    const getColumnValues = (colIndex) => {
      return cy.get('tbody tr')
        .not(':first') // skip search/filter row
        .filter(':visible')
        .then($rows => {
          return [...$rows].map(row => {
            const cell = row.querySelectorAll('td')[colIndex];
            return cell?.innerText.trim() || '';
          });
        });
    };
  
    const searchColumn = (fullColIndex, inputIndex, columnName = '') => {
      return getColumnValues(fullColIndex).then(() => {
        cy.log(`Testing search for column ${fullColIndex}: ${columnName}`);
    
        cy.get('tbody tr:visible')
          .not(':first')
          .first()
          .find('td')
          .eq(fullColIndex)
          .invoke('text')
          .then((text) => {
            const searchValue = text.trim();
            if ((!searchValue) || columnsToSkipByName.includes(columnName)) {
              cy.log(`No value in column ${fullColIndex} (${columnName}), skipping search`);
              return;
            }
    
            // 🔄 Now use inputIndex for the search field
            cy.get('tbody tr:first input')
              .eq(inputIndex)
              .clear()
              .type(`${searchValue}{enter}`);
    
            cy.wait(500);
            cy.get('tbody tr:visible')
              .not(':first')
              .each($row => {
                const cell = $row.find('td').eq(fullColIndex).text().trim();
                expect(cell, `Row should contain "${searchValue}" in column ${fullColIndex} (${columnName})`).to.contain(searchValue);
              });
          });
      });
    };
  });