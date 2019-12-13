module.exports = {
  roots: ["<rootDir>"],
  transform: {
    ".ts": "ts-jest"
  },
  testRegex: "test.ts",
  moduleFileExtensions: ["ts", "js"],
  globalSetup: "./test/test-setup.ts",
  globalTeardown: "./test/test-teardown.ts"
};
