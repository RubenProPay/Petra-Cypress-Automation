const { defineConfig } = require("cypress");
const { faker } = require('@faker-js/faker');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        generateUser() {
          const name = faker.person.firstName();
          const surname = faker.person.lastName();
          const id_number = faker.number.int({ min: 1000000000000, max: 9999999999999 }).toString();
          const cell = '0' + faker.number.int({ min: 600000000, max: 899999999 });
          const email = faker.internet.email({ firstName: name, lastName: surname }).toLowerCase();
          const language_id = faker.helpers.arrayElement([0, 1]); // 1 = Afrikaans, 2 = English (example)
          const call_center_id = faker.number.int({ min: 0, max: 10 }); // Simulated ID range

          return {
            name,
            surname,
            id_number,
            cell,
            email,
            language_id,
            call_center_id
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
