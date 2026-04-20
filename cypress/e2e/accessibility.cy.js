function logViolations(violations) {
  violations.forEach((violation) => {
    // eslint-disable-next-line no-console
    console.log(
      `[axe] ${violation.id}: ${violation.help} (${violation.nodes.length} nodes)`
    )
  })
}

describe('Accessibility smoke tests', () => {
  it('has no detectable a11y violations on home', () => {
    cy.visit('/')
    cy.injectAxe()
    cy.checkA11y(null, null, logViolations)
  })

  it('has no detectable a11y violations on contact', () => {
    cy.visit('/contact')
    cy.injectAxe()
    cy.checkA11y(null, null, logViolations)
  })
})
