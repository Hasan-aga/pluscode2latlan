// metro.config.js
const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "db",
  "sqlite",
  "mp3",
  "ttf",
  "otf",
  "cjs"
]

module.exports = config
