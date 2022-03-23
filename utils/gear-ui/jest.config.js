module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: { '.(css|scss)$': 'identity-obj-proxy' },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
