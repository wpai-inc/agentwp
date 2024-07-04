/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/$1', // Adjust path as per your tsconfig.json
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    ".+\\.(svg|css|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
  },
  testMatch: ['<rootDir>/client/**/*.test.(ts|tsx)'],
};