const DEFAULT_NUM_OF_RECOMMENDATIONS = 5;

describe('Test getting recommendations', () => {
    it('redirects to recommendations', () => {
        cy.visit('/song-picking');

        cy.get('.mat-mdc-autocomplete-trigger')
            .click()
            .type('Radiohead Creep');
        cy.get('.searchResults').should((items) => {
            expect(items).to.contain.text('Radiohead');
        });
        cy.get('.searchResults').contains('Creep').click();

        cy.contains('Get Recommendations').click();

        cy.url().should('include', 'recommendations', {timeout: 4000});
    });

    it('gets some recommendations', () => {
        cy.visit('/song-picking');

        cy.get('.mat-mdc-autocomplete-trigger')
            .click()
            .type('Radiohead Creep');
        cy.get('.searchResults').should((items) => {
            expect(items).to.contain.text('Radiohead');
        });
        cy.get('.searchResults').contains('Creep').click();

        cy.get('.mat-mdc-autocomplete-trigger')
            .click()
            .type('Bohemian Rhapsody Queen');
        cy.get('.searchResults').should((items) => {
            expect(items).to.contain.text('Queen');
        });
        cy.get('.searchResults').contains('Queen').click();

        cy.get('.mat-mdc-autocomplete-trigger')
            .click()
            .type('Coldplay Yellow');
        cy.get('.searchResults').should((items) => {
            expect(items).to.contain.text('Yellow');
        });
        cy.get('.searchResults').contains('Yellow').click();

        cy.contains('Get Recommendations').click();

        cy.get('.resultRecommendations').should(items => {
            expect(items).to.have.length.above(DEFAULT_NUM_OF_RECOMMENDATIONS);
        });

    });
});
