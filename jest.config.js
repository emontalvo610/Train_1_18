const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  transformIgnorePatterns: [
    "/node_modules/(?!(@auth0/auth0-react|@auth0/auth0-spa-js|jose)/)",
  ],
  testEnvironment: "node",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};

module.exports = createJestConfig(customJestConfig);
