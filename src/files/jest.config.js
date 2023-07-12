export default {
  verbose: true,
  testEnvironment: "jest-environment-jsdom",
  resetMocks: true,
    // Keeps jest from blowing up imports in the code files.
  extensionsToTreatAsEsm: ['.ts']
}
