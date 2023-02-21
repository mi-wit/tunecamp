const sizes = ['iphone-6', 'samsung-s10', 'macbook-16']

describe('Searching for a song', () => {
    sizes.forEach((size) => {

        it(`Should search song on ${size} screen`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.visit('/song-picking');
            cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
            cy.get('.searchResults').contains('Radiohead').should('be.visible');
        });

        it(`Should be visible on the list on ${size} screen`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.visit('/song-picking');
            cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
            cy.get('.searchResults').contains('Radiohead').click();
            cy.get('.bg-gray-900.ng-star-inserted').contains('Radiohead').should('be.visible');
        });
    })
})

describe('Pick few songs', () => {
    sizes.forEach((size) => {

        it(`Should search few songs on ${size} screen`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

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
            .should('contain', 'Radiohead').should('be.visible')
            .and('contain', 'Queen').should('be.visible')
            .and('contain', 'Coldplay').should('be.visible');
        })
    })
})


describe('Get recommendations button', () => {
    sizes.forEach((size) => {

        it(`Should display button on ${size} screen`, () => {
            if (Cypress._.isArray(size)) {
                cy.viewport(size[0], size[1])
            } else {
                cy.viewport(size)
            }

            cy.visit('/song-picking');
            cy.contains('Get Recommendations').should('be.disabled').and('be.visible');
            cy.get('.mat-mdc-autocomplete-trigger').click().type('Radiohead Creep');
            cy.get('.searchResults').contains('Radiohead').click();
            cy.contains('Get Recommendations').should('not.be.disabled').and('be.visible');
        });

    })
})