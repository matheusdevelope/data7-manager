let NameApp = "";
if (process.env.VITE_APP_VERSION === undefined) {
  const package = require("./package.json");
  NameApp = package.description;
  process.env.VITE_APP_VERSION = package.version;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */

const config = {
  productName: NameApp,
  directories: {
    output: "dist",
    buildResources: "buildResources",
  },
  extraResources: ["node_modules/sybase/JavaSybaseLink/**/*"],
  files: ["packages/**/dist/**"],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
    // requestedExecutionLevel: "highestAvailable",
    icon: "./icon.png",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    // allowElevation: true,
    allowToChangeInstallationDirectory: true,
    artifactName: NameApp + " v" + process.env.VITE_APP_VERSION + " .${ext}",
    shortcutName: NameApp,
    createDesktopShortcut: false,
  },
};

module.exports = config;
