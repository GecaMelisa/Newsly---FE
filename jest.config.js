const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/system/**/*.test.ts", "**/__tests__/**/*.test.ts"],
  coverageReporters: ["text", "lcov", "json", "html"],
};
