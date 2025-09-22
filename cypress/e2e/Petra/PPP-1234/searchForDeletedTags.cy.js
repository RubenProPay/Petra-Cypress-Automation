describe('Check deleted tags in /tags', () => {
  const tagsToCheck = [
    'Silver status',
    'Goue status',
    'Platinum',
    'N1 Veldtog',
    'Plaaseienaars',
    'Bydraer',
    'Mailchimp unsubscribed',
    'Terug na mailchimp',
    'Fatal epos probleem',
    'Nie geregistreer',
    'Elders geregistreer',
    'Kandidaat2019',
    'Dagbestuur lid',
    'VS-Partyraad',
    'VSDB-lid',
    'Ledegeld',
    'Welkom SMS',
    'Vergaderings reel',
    'Compuscan complete',
    'Compuscan Processed',
    'Compuscan (recheck)',
    'Geen handtekening',
    'Partyagent',
    'IEC registered',
    'Not verified',
    'Not verified (checked)',
    'Geen Selfoon Kontak Beson',
    'Davina Cell fix',
    'OVK - Nie geregistreer',
    'Hernu lidmaatskap',
    'DBT bedrag',
    'FHK oudit',
    'Raadslid',
    'LP / LPW',
    '2021 Potensiële kandidaat',
    'Active pending',
    'Nie gerigestreer by IEC',
    'Ledegeld kontant betaal',
    'Aktiewe lid 2019',
    'Ver Oos London',
    'Afwesige kontakbesonderhe',
    'Takstigting teenwoordig',
    'Oorlede lid',
    'IEC registrasie',
    'Whatsapp ledegroep',
    'Takvoorsitter',
    'Taksekretaris',
    'Takondervoorsitter',
    'Tak addisionele bestuursl',
    'Taksecudus',
    'Takbestuurslid',
    'Ledegeld opvolg',
    'Taklid',
    'VS-Partyraadslid',
    'LP',
    'LPW',
    '2021',
    'Adres onvolledig',
    'Posadres',
    'OVK verkeerde provinsie',
    'Nie by OVK geregistreer',
    'Takbetrokkenheid',
    'EFT',
    'Ledegeld',
    'Debietorder',
    'Debietorder - Nie verwerk',
    'Donasie',
    'Aansoek kandidaat',
    'EFT',
    '2021-Vervoer',
    '2021 Raadslid',
    'Adres verander',
    'Engels WhatsApp',
    'EFT betaling',
    '1 Kwartaal D/O',
    '2 Kwartaal D/O',
    '3 Kwartaal D/O',
    '4 Kwartaal D/O'
  ];

  let foundTags = [];

  before(() => {
    cy.loginRoot();
  });

  it('Checks each tag for presence in /tags', () => {
    cy.visit('/tags');
    cy.wait(1000);

    const logLines = [];
    cy.wrap(tagsToCheck).each((tag) => {
      cy.get('input[type="search"]').clear().type(tag, { delay: 50 });
      cy.get('body').type('{enter}');
      cy.wait(1000);
      cy.document().then((doc) => {
        const found = Array.from(doc.querySelectorAll('td')).some(td => td.textContent.trim() === tag);
        if (found) {
          cy.log(`Tag FOUND: ${tag}`);
          foundTags.push(tag);
          logLines.push(`FOUND: ${tag}`);
        } else {
          cy.log(`Tag NOT found: ${tag}`);
          logLines.push(`NOT FOUND: ${tag}`);
        }
      });
    }).then(() => {
      let summary = '';
      if (foundTags.length > 0) {
        cy.log('Tags still appearing (should be deleted):');
        foundTags.forEach(tag => cy.log(tag));
        summary = 'Tags still appearing (should be deleted):\n' + foundTags.join('\n');
      } else {
        cy.log('No deleted tags are still appearing.');
        summary = 'No deleted tags are still appearing.';
      }
      logLines.push('');
      logLines.push(summary);
      cy.writeFile('cypress/logs/tags_search_results.log', logLines.join('\n'));
    });
  });
});
