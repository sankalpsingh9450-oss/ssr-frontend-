import {
  contactFormSchema,
  getBusinessEmailHint,
  mapFilesToMetadata,
  newsletterSchema,
  quoteRequestSchema,
} from '../../src/lib/formSchemas'

describe('formSchemas', () => {
  test('accepts a valid quote request payload', () => {
    expect(() =>
      quoteRequestSchema.parse({
        fullName: 'SSR Client',
        email: 'client@example.com',
        phone: '+919876543210',
        serviceType: 'Residential Construction',
        projectDescription: 'Need a full construction estimate for a 2200 sq ft villa project.',
        budgetRange: '₹25L - ₹50L',
        timeline: 'Within 3 months',
        attachments: [{ name: 'brief.pdf', size: 1024, type: 'application/pdf' }],
        termsAccepted: true,
      })
    ).not.toThrow()
  })

  test('rejects oversized attachment totals', () => {
    expect(() =>
      quoteRequestSchema.parse({
        fullName: 'SSR Client',
        email: 'client@example.com',
        phone: '+919876543210',
        serviceType: 'Residential Construction',
        projectDescription: 'Need a full construction estimate for a 2200 sq ft villa project.',
        timeline: 'Immediate',
        attachments: [{ name: 'brief.pdf', size: 11 * 1024 * 1024, type: 'application/pdf' }],
        termsAccepted: true,
      })
    ).toThrow('Total attachment size must stay under 10MB.')
  })

  test('requires full contact form message length', () => {
    expect(() =>
      contactFormSchema.parse({
        name: 'SSR',
        email: 'client@example.com',
        phone: '+919876543210',
        subject: 'Construction Quote',
        message: 'Too short',
        preferredContactMethod: 'Phone',
      })
    ).toThrow('Please share at least 50 characters')
  })

  test('newsletter accepts preferences', () => {
    expect(newsletterSchema.parse({ email: 'news@example.com', preferences: ['Interior Design'] })).toEqual({
      email: 'news@example.com',
      preferences: ['Interior Design'],
    })
  })

  test('maps uploaded files into metadata', () => {
    const files = [{ name: 'a.pdf', size: 1234, type: 'application/pdf' }]
    expect(mapFilesToMetadata(files)).toEqual(files)
  })

  test('shows business email hint for free email domains', () => {
    expect(getBusinessEmailHint('person@gmail.com', 'SSR Vendor')).toMatch(/company email/i)
    expect(getBusinessEmailHint('person@company.com', 'SSR Vendor')).toBe('')
  })
})
