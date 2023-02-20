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
