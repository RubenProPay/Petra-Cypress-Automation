// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
  const livewireIgnoreList = [
    'Component already registered',
    'Component already initialized',
    'Uncaught Snapshot missing on Livewire component with id:',
    'Could not find Livewire component in DOM tree',
    'areFiltersOpen is not defined',
  ];

  if (livewireIgnoreList.some(substring => err.message.includes(substring))) {
    return false; // prevent Cypress from failing the test
  }

  // Let other errors fail the test
  return true;
});
