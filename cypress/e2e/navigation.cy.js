describe('SSR Group Civil navigation', () => {
  it('loads homepage and navigates to services', () => {
    cy.visit('/')
    cy.contains('Premium Construction & Real Estate Solutions').should('be.visible')
    cy.get('a[href="/services"]').first().click({ force: true })
    cy.url().should('include', '/services')
  })

  it('opens mobile menu and reaches projects', () => {
    cy.viewport('iphone-x')
    cy.visit('/')
    cy.get('[aria-label="Open navigation menu"]').click({ force: true })
    cy.get('#mobile-navigation').should('be.visible').within(() => {
      cy.contains('Projects').click({ force: true })
    })
    cy.url().should('include', '/projects')
  })
})
