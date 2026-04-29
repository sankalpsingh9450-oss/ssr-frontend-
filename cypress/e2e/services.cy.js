describe('Services page experience', () => {
  it('filters services by category and updates the featured service', () => {
    cy.visit('/services')
    cy.contains('What Do You Need?').should('be.visible')
    cy.contains('Choose your focus area').should('be.visible')

    cy.contains('Commercial').click()
    cy.get('#service-selector').should('exist')
    cy.get('#service-selector').select('Commercial Projects')
    cy.contains('Commercial Projects').should('be.visible')

    cy.contains('Build My Property').click()
    cy.get('#service-catalogue').should('be.visible')
  })
})
