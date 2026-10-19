// Hoisted workspace dependencies must use the same React instance as this app.
const reactDirectory = require.resolve("react/package.json").replace(/\/package\.json$/, "");
const reactDOMDirectory = require.resolve("react-dom/package.json").replace(/\/package\.json$/, "");
const refreshRuntime = require.resolve("react-refresh/runtime", {
  paths: [require.resolve("@pmmmwh/react-refresh-webpack-plugin")],
});

module.exports = {
  webpack: {
    alias: {
      react: reactDirectory,
      "react-dom": reactDOMDirectory,
    },
    configure: (config) => {
      const scope = config.resolve.plugins.find(
        (plugin) => plugin.constructor.name === "ModuleScopePlugin",
      );
      if (scope) {
        scope.allowedPaths.push(reactDirectory, reactDOMDirectory);
        scope.allowedFiles.add(refreshRuntime);
      }
      return config;
    },
  },
  eslint: {
    pluginOptions: {
      eslintPath: require.resolve("eslint"),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        "^react$": require.resolve("react"),
        "^react/(.*)$": `${reactDirectory}/$1`,
        "^react-dom$": require.resolve("react-dom"),
        "^react-dom/(.*)$": `${reactDOMDirectory}/$1`,
      },
    },
  },
};
