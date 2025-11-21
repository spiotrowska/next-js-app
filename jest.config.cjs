/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      { tsconfig: 'tsconfig.json', useESM: true },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  // Transpile ESM packages we rely on.
  transformIgnorePatterns: [
    'node_modules/(?!(@uiw|rehype-prism-plus|msw)/)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    'next/router': 'next-router-mock',
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '^@uiw/react-md-editor$': '<rootDir>/__mocks__/md-editor-stub.js'
    ,'^next-auth$': '<rootDir>/__mocks__/next-auth.js'
    ,'^next-auth/providers/github$': '<rootDir>/__mocks__/next-auth-provider-github.js'
    ,'^@/lib/actions$': '<rootDir>/__mocks__/lib-actions.js'
    ,'^lib/actions$': '<rootDir>/__mocks__/lib-actions.js'
    ,'^next-sanity$': '<rootDir>/__mocks__/next-sanity.js'
    ,'^server-only$': '<rootDir>/__mocks__/server-only.js'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    './lib/**/*.ts': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
    './components/StartupForm.tsx': {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    }
  },
};
