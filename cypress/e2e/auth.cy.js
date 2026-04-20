describe('Authentication flow', () => {
  it('registers and redirects to the dashboard', () => {
    cy.visit('/register')
    cy.get('#register-name').type('SSR Client')
    cy.get('#register-email').type('client@example.com')
    cy.get('#register-phone').clear().type('+919876543210')
    cy.get('#register-password').type('Password123')
    cy.get('#register-confirm-password').type('Password123')
    cy.get('input[name="termsAccepted"]').check({ force: true })
    cy.contains(/^create account$/i).should('not.be.disabled').click()

    cy.url().should('include', '/profile')
    cy.contains(/profile overview/i).should('be.visible')
  })

  it('logs in and reaches the dashboard', () => {
    cy.visit('/login')
    cy.get('#login-email').type('client@example.com')
    cy.get('#login-password').type('Password123')
    cy.contains(/^sign in$/i).click()

    cy.url().should('include', '/profile')
    cy.contains(/profile overview/i).should('be.visible')
  })
})
