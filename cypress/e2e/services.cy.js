describe('Services page experience', () => {
  it('filters services by category and updates the featured service', () => {
    cy.visit('/services')
    cy.contains('Construction, procurement, and advisory services').should('be.visible')

    cy.contains('Commercial').click()
    cy.get('#service-selector').should('exist')
    cy.get('#service-selector').select('Commercial Projects')
    cy.contains('Commercial Projects').should('be.visible')

    cy.contains('Explore All Services').click()
    cy.url().should('include', '/services')
    cy.get('#service-catalogue').should('be.visible')
  })
})
