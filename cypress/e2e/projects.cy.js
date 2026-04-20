describe('Projects portfolio', () => {
  it('filters the project grid and opens a contact CTA', () => {
    cy.visit('/projects')
    cy.contains('Built work, current sites, and project proof').should('be.visible')

    cy.contains('Commercial').click()
    cy.get('#project-grid').should('be.visible')
    cy.contains('Request similar project').first().click()
    cy.url().should('include', '/contact')
  })
})
