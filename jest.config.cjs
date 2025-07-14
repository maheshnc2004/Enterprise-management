module.exports = {
  testEnvironment: "jsdom", // Enables `window`, `document`, `localStorage`, etc.
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Mocks + extensions
  moduleFileExtensions: ["js", "jsx"], // Optional: For JSX support
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(test).[jt]s?(x)"], // Optional: Controls test file matching
};
