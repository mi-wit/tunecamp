describe('Test Welcome page', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Search for songs')
  })
})

describe('Test song-picking page', () => {
  it('Visits the song-picking project page', () => {
    cy.visit('/song-picking')
    cy.contains("Let's find some tunes!")
  })
})

describe('Test search field', () => {
  it('searches for a song', () => {
    cy.visit('/song-picking');
    cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
    cy.get('.searchResults').contains('Radiohead');
  });

  it('clears search field after picking song', () => {
    cy.visit('/song-picking');
    cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
    cy.get('.searchResults').contains('Creep').click();
    cy.get('.mat-mdc-autocomplete-trigger').should('be.empty');
  });

  it('shows no results', () => {
    cy.visit('/song-picking');
    cy.get('.mat-mdc-autocomplete-trigger').click().type('lkjhgfdsazxcvbnmpoiuytrs yg fyfuahsf shufs');
    cy.get('.searchResults').contains('No results');
  });
}) 

describe('Test song picking', () => {
  it('picks few sogs and adds them to list', () => {
    cy.visit('/song-picking');

    cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
    cy.get('.searchResults').should((items) => {
      expect(items).to.contain.text('Radiohead');
    });
    cy.get('.searchResults').contains('Creep').click();

    cy.get('.mat-mdc-autocomplete-trigger').click().type('Bohemian Rhapsody Queen');
    cy.get('.searchResults').should((items) => {
      expect(items).to.contain.text('Queen');
    });
    cy.get('.searchResults').contains('Queen').click();

    cy.get('.mat-mdc-autocomplete-trigger').click().type('Coldplay Yellow');
    cy.get('.searchResults').should((items) => {
      expect(items).to.contain.text('Yellow');
    });
    cy.get('.searchResults').contains('Yellow').click();

    cy.get('.bg-gray-900.ng-star-inserted')
      .should('contain', 'Radiohead')
      .and('contain', 'Queen')
      .and('contain', 'Coldplay');
  });

  it('picks song and removes it', () => {
    cy.visit('/song-picking');

    cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
    cy.get('.searchResults').should((items) => {
      expect(items).to.contain.text('Radiohead');
    });
    cy.get('.searchResults').contains('Creep').click();


    cy.contains('Remove').click();
    cy.contains('Creep').should('not.exist');
  });

  it('activates get recommendations button', () => {
    cy.visit('/song-picking');

    cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
    cy.get('.searchResults').should((items) => {
      expect(items).to.contain.text('Radiohead');
    });
    cy.get('.searchResults').contains('Creep').click();


    cy.contains('Get Recommendations').should('not.be.disabled');
  });

  it('deactivates get recommendations button', () => {
    cy.visit('/song-picking');

    cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
    cy.get('.searchResults').should((items) => {
      expect(items).to.contain.text('Radiohead');
    });
    cy.get('.searchResults').contains('Creep').click();

    cy.contains('Remove').click();
    cy.contains('Get Recommendations').should('be.disabled');
  });
})