import { z } from 'zod'

const MAX_TOTAL_ATTACHMENT_SIZE = 10 * 1024 * 1024
const MAX_ATTACHMENTS = 5
const FREE_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com']

export const indianPhoneRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/

const fileSchema = z.object({
  name: z.string(),
  size: z.number().nonnegative(),
  type: z.string().optional(),
})

const attachmentsSchema = z
  .array(fileSchema)
  .max(MAX_ATTACHMENTS, `You can upload up to ${MAX_ATTACHMENTS} files only.`)
  .superRefine((files, ctx) => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > MAX_TOTAL_ATTACHMENT_SIZE) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Total attachment size must stay under 10MB.',
      })
    }
  })

export const quoteRequestSchema = z.object({
  fullName: z.string().trim().min(3, 'Please enter at least 3 characters.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, 'Please enter a valid Indian number like +91 9876543210.'),
  serviceType: z.string().trim().min(1, 'Please select a service type.'),
  projectDescription: z.string().trim().min(20, 'Please share at least 20 characters about the project.'),
  budgetRange: z.string().trim().optional(),
  timeline: z.string().trim().min(1, 'Please choose your expected timeline.'),
  attachments: attachmentsSchema.default([]),
  termsAccepted: z.boolean().refine((value) => value, {
    message: 'Please accept the terms to continue.',
  }),
})

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your name.'),
    email: z.string().trim().email('Please enter a valid email address.'),
    phone: z
      .string()
      .trim()
      .regex(indianPhoneRegex, 'Please enter a valid Indian number like +91 9876543210.'),
    intent: z.enum(['Construction', 'Property', 'Investment', 'Other'], {
      error: () => ({ message: 'Please choose what you need help with.' }),
    }),
    subject: z.string().trim().optional(),
    message: z.string().trim().min(50, 'Please share at least 50 characters so we can respond properly.'),
    preferredContactMethod: z.enum(['Phone', 'Email', 'WhatsApp'], {
      error: () => ({ message: 'Please select your preferred contact method.' }),
    }),
    plotSize: z.string().trim().optional(),
    projectStage: z.string().trim().optional(),
    budget: z.string().trim().optional(),
    preferredLocation: z.string().trim().optional(),
    investmentGoal: z.string().trim().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.intent === 'Construction') {
      if (!values.plotSize) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['plotSize'],
          message: 'Please share the plot size or site area.',
        })
      }
      if (!values.projectStage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['projectStage'],
          message: 'Please select your current project stage.',
        })
      }
    }

    if (values.intent === 'Property') {
      if (!values.budget) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['budget'],
          message: 'Please share your budget range.',
        })
      }
      if (!values.preferredLocation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['preferredLocation'],
          message: 'Please share your preferred location.',
        })
      }
    }

    if (values.intent === 'Investment') {
      if (!values.budget) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['budget'],
          message: 'Please share your investment budget.',
        })
      }
      if (!values.investmentGoal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['investmentGoal'],
          message: 'Please share your investment goal.',
        })
      }
    }
  })

export const newsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  name: z.string().trim().optional(),
  preferences: z.array(z.string()).default([]),
})

export const businessInquirySchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  companyName: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, 'Please enter a valid Indian number like +91 9876543210.'),
  message: z.string().trim().min(20, 'Please share at least 20 characters about your enquiry.'),
})

export const propertyLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  phone: z.string().trim().regex(/^\d{10}$/, 'Please enter a valid 10 digit phone number.'),
  budget: z.enum(['50L-1Cr', '1Cr-3Cr', '3Cr-5Cr'], {
    error: () => ({ message: 'Please select your budget range.' }),
  }),
})

export const exitIntentLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, 'Please enter a valid Indian number like +91 9876543210.'),
  email: z.string().trim().email('Please enter a valid email address.'),
})

export function getConsultationLeadSchema({ requirePlotSize = false, requireBudget = false } = {}) {
  return z.object({
    name: z.string().trim().min(2, 'Please enter your name.'),
    email: z.string().trim().email('Please enter a valid email address.'),
    phone: z
      .string()
      .trim()
      .regex(indianPhoneRegex, 'Please enter a valid Indian number like +91 9876543210.'),
    service: z.string().trim().min(1, 'Service context is required.'),
    property_id: z.string().trim().optional(),
    plotSize: requirePlotSize
      ? z.string().trim().min(2, 'Please share your plot size or site area.')
      : z.string().trim().optional(),
    budget: requireBudget
      ? z.string().trim().min(2, 'Please share your target budget.')
      : z.string().trim().optional(),
  })
}

export const siteVisitLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, 'Please enter a valid Indian number like +91 9876543210.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  preferredVisitDate: z.string().trim().min(1, 'Please select your preferred visit date.'),
  property_id: z.string().trim().min(1, 'Property context is required.'),
  property_title: z.string().trim().min(1, 'Property title is required.'),
})

export const constructionCalculatorLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.'),
  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, 'Please enter a valid Indian number like +91 9876543210.'),
  email: z.string().trim().email('Please enter a valid email address.'),
})

export function mapFilesToMetadata(fileList) {
  return Array.from(fileList || []).map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
  }))
}

export function getBusinessEmailHint(email = '', companyName = '') {
  if (!email || !companyName) return ''

  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain || FREE_EMAIL_DOMAINS.includes(domain)) {
    return 'A company email is recommended for faster partner verification, but it is optional.'
  }

  return ''
}
