const { defineConfig } = require("cypress");
const { faker } = require('@faker-js/faker');

module.exports = defineConfig({
  e2e: {
    experimentalSessionAndOrigin: true, // <-- Add this line
    setupNodeEvents(on, config) {
      on('task', {
        generateUser() {
          const name = faker.person.firstName();
          const surname = faker.person.lastName();
          const id_number = faker.number.int({ min: 1000000000000, max: 9999999999999 }).toString();
          const cell = '0' + faker.number.int({ min: 600000000, max: 899999999 });
          const email = faker.internet.email({ firstName: name, lastName: surname }).toLowerCase();

          const language = faker.helpers.arrayElement(['Afrikaans', 'English']);
          const role = faker.helpers.arrayElement(['Data Capturer', 'National Admin (Head Office)', 'Provincial Admin', 'User (Viewer)']);
          const call_center = faker.helpers.arrayElement(['Eastern Cape Call Centre', 'Free State Call Centre', 'Gauteng Call Centre', 'Kwazulu-Natal Call Centre', 'Limpopo Call Centre', 'Mpumalanga Call Center', 'Northern Cape Call Centre', 'North West Call Centre', 'Western Cape Call Centre', 'International Call Centre', 'Head Office']);

          return {
            name,
            surname,
            id_number,
            cell,
            email,
            language,
            call_center,
            role
          };
        }
      });

      return config;
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    baseUrl: "https://staging.political.propaysystems.com/",
    experimentalStudio: true,
  },
});
