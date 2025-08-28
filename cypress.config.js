const { defineConfig } = require("cypress");
const { faker } = require('@faker-js/faker');

module.exports = defineConfig({
  projectId: 'jkbuo6',
  e2e: {
    experimentalSessionAndOrigin: true, // <-- Add this line
    setupNodeEvents(on, config) {

      on('task', {
        generateUser() {
          const name = faker.person.firstName();
          const surname = faker.person.lastName();
          const email = faker.internet.email({ firstName: name, lastName: surname }).toLowerCase();
          const language = faker.helpers.arrayElement(['Afrikaans', 'English']);
          const role = faker.helpers.arrayElement(['Data Capturer', 'National Admin (Head Office)', 'Provincial Admin', 'User (Viewer)']);
          const call_centre = faker.helpers.arrayElement(['Eastern Cape Call Centre', 'Free State Call Centre', 'Gauteng Call Centre', 'Kwazulu-Natal Call Centre', 'Limpopo Call Centre', 'Mpumalanga Call Centre', 'Northern Cape Call Centre', 'North West Call Centre', 'Western Cape Call Centre', 'International Call Centre', 'Head Office']);
          return {
            name,
            surname,
            email,
            language,
            call_centre,
            role
          };
        },
        generateMember() {
          const member_type = faker.helpers.arrayElement(['Active Member', 'Non member', 'Normal Member', 'Supporter']);
          const firstname = faker.person.firstName();
          const surname = faker.person.lastName();
          const title = faker.helpers.arrayElement(['Dr.', 'Ds.', 'Miss.', 'Mr.', 'Mrs.', 'Ms.']);
          const gender = faker.helpers.arrayElement(['Male', 'Female']);
          const language = faker.helpers.arrayElement(['Afrikaans', 'English']);
          const email = faker.internet.email({ firstName: firstname, lastName: surname }).toLowerCase();
          const address = {
            address2: faker.location.streetAddress(),
            address3: faker.location.secondaryAddress(),
            address4: faker.location.city(),
            address5: faker.location.zipCode(),
            province: faker.helpers.arrayElement([
              'Eastern Cape', 'Free State', 'Gauteng', 'International', 'KwaZulu-Natal',
              'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Unknown', 'Western Cape'
            ])
          };
          return {
            member_type,
            firstname,
            surname,
            title,
            gender,
            language,
            email,
            address
          };
        }
      });

      return config;
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    baseUrl: "https://staging.political.propaysystems.com/",
    // baseUrl: "https://qa.petra.propaysystems.com/",
    // baseUrl: "https://vfplus.datakrag.co.za/",
    experimentalStudio: true,
  },
});
