describe('Check Activities page for all users', () => {
	let users = [];
	let logLines = [];

	before(() => {
		cy.loginRoot();
		cy.readFile('cypress/files/usersActivityLog - Sheet1.csv').then((csv) => {
			// Parse CSV to array of objects
			const lines = csv.split('\n').filter(Boolean);
			const headers = lines[0].split(',');
			users = lines.slice(1).map(line => {
				const values = line.split(',');
				const obj = {};
				headers.forEach((h, i) => obj[h.trim()] = values[i] ? values[i].trim() : '');
				return obj;
			});
		});
	});

	it('Checks Activities page loads for each user', () => {
					cy.wrap(users).each((user) => {
						cy.wait(1000);
						if (!user.Email || user.Email === '--') {
							logLines.push(`SKIPPED: ${user.Name} ${user.Surname} (no email)`);
							return;
						}
						cy.visit('/');
						cy.wait(1000);
						cy.sideNav('Users', 'users/user');
						cy.get('input[type="search"]')
							.should('be.visible')
							.clear()
							.type(user.Email, { delay: 50 });
						cy.get('body').type('{enter}');
						cy.wait(1000);
						cy.contains('td', user.Email)
							.parents('tr')
							.within(() => {
								cy.get('button').first().click();
							});
						cy.contains('button', 'Edit').click();
						cy.wait(1000);
								// Make Activities tab click more robust with retry logic
								cy.contains('a', 'Activities').should('be.visible').as('activitiesTab');
								cy.wait(750);
								cy.get('@activitiesTab').should('exist').should('be.visible').then($el => {
									// Wait until the tab is not disabled and is actionable
									if (!$el.is(':disabled')) {
										cy.wrap($el).click({ force: true });
									} else {
										// Retry clicking after a short wait if not actionable
										cy.wait(500);
										cy.wrap($el).click({ force: true });
									}
								});
								cy.wait(1000);
						// Check for error message or page load
						cy.get('body').then($body => {
							if ($body.text().includes('error') || $body.text().includes('Error')) {
								cy.log(`ERROR: Activities page for ${user.Email}`);
								logLines.push(`ERROR: ${user.Name} ${user.Surname} (${user.Email})`);
							} else {
								cy.log(`SUCCESS: Activities page loaded for ${user.Email}`);
								logLines.push(`SUCCESS: ${user.Name} ${user.Surname} (${user.Email})`);
							}
						});
					}).then(() => {
						cy.writeFile('cypress/logs/users_activities_check.log', logLines.join('\n'));
					});
				});
});
