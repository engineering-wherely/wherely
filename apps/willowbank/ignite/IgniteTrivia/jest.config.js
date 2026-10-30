/** @type {import('@jest/types').Config.ProjectConfig} */
module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/test/setup.ts"],
  moduleNameMapper: {
    // Use MobX's Node entry point in Jest instead of its React Native ESM export.
    "^mobx$": require.resolve("mobx"),
    // Keep hooks and the renderer on the app's React instance in the monorepo.
    "^react$": require.resolve("react"),
    "^react/(.*)$": "<rootDir>/node_modules/react/$1",
  },
}
