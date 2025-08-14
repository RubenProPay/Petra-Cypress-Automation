import 'cypress-xpath';
import 'cypress-file-upload';

// Selecting user Call Centre and Provinces
Cypress.Commands.add('selectCallCentreAndProvinces', (userFixture) => {
  const { role, call_centre, province } = userFixture;

  // Select Call Centre using stable logic
  cy.searchableDropdown('call_center_id', 'Call Centre', call_centre, { clear: true });

  // Wait for Livewire to finish updating the provinces
  if (call_centre === 'Head Office') {
    cy.wait(1000);
  }

  // If Head Office user, select ALL provinces using existing dropdown command
  if (role === 'National Admin (Head Office)' && call_centre === 'Head Office') {
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

  const callCentres = Object.keys(roleToRegionMap);
  callCentres.push('Head Office');

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
            userFixture.call_centre = 'Head Office';
            userFixture.provinces = allProvinces;
          } else {
            const entries = Object.entries(roleToRegionMap);
            const [callCentre, province] = entries[Math.floor(Math.random() * entries.length)];
            userFixture.call_centre = callCentre;
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