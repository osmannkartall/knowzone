export default {
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  globalSetup: '<rootDir>/test/globalSetup.js',
  globalTeardown: '<rootDir>/test/globalTeardown.js',
  setupFilesAfterEnv: [
    '<rootDir>/test/setupFile.js',
  ],
  maxWorkers: 4,
  verbose: true,
  detectOpenHandles: true,
  transform: {},
};
