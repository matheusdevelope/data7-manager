if (process.env.VITE_APP_VERSION === undefined) {
  // const now = new Date();
  const package = require("./package.json");
  process.env.VITE_APP_VERSION = package.version; //`${now.getUTCFullYear() - 2000}.${now.getUTCMonth() + 1}.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  productName: "Data7 Manager",
  directories: {
    output: "dist",
    buildResources: "buildResources",
  },
  files: ["packages/**/dist/**"],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
};

module.exports = config;
