export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: { '\\.(css|scss)$': 'identity-obj-proxy', '\\.svg$': '<rootDir>/src/fileMock.ts' },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  clearMocks: true,
};
