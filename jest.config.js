/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterHooks: ['<rootDir>/tests/setup.ts'],
};

module.exports = config;