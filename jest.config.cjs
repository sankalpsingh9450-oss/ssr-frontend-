module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'cjs', 'json'],
  transform: {
    '^.+\\.[jt]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'ecmascript',
            jsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif|webp|avif)$': './fileMock.js',
  },
  collectCoverageFrom: [
    'src/lib/authSchemas.js',
    'src/lib/formSchemas.js',
    'src/lib/formApi.js',
    'src/lib/session.js',
    'src/lib/dashboardSchemas.js',
    'src/lib/chatbotEngine.js',
    'src/pages/ForgotPassword.jsx',
    'src/pages/Login.jsx',
    'src/pages/Register.jsx',
    'src/components/Navbar.jsx',
    'src/components/forms/QuoteRequestForm.jsx',
    'src/components/forms/ContactInquiryForm.jsx',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
