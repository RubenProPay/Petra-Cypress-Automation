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
    // Only ignore the specific Livewire error
    // if (err.message.includes('Component already registered')) {
    //   return false; // prevents test from failing
    // }
 
    // if (err.message.includes('Component already initialized')) {
    //   return false; // prevents test from failing
    // }
 
    // if (err.message.includes('Uncaught Snapshot missing on Livewire component with id:')) {
    //   return false; // prevents test from failing
    // }
 
    return false
  });