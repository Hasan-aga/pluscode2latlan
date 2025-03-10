import { Asset } from "expo-asset"
import * as FileSystem from "expo-file-system"
import * as SQLite from "expo-sqlite"

const DB_NAME = "geonames.db"
const DB_PATH = FileSystem.documentDirectory + "SQLite/" + DB_NAME

async function copyDatabase() {
  const { exists } = await FileSystem.getInfoAsync(DB_PATH)
  if (!exists) {
    try {
      console.log("Copying database...")

      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "SQLite",
        { intermediates: true }
      )
      const asset = Asset.fromModule(require(`../assets/db/${DB_NAME}`))
      console.log("Downloading database asset", asset)

      await FileSystem.downloadAsync(asset.uri, DB_PATH)
      // Add this verification
      const assetSize = (await FileSystem.getInfoAsync(asset.uri)).size
      if (assetSize === 0) {
        throw new Error("Database asset is empty")
      }
      const copiedSize = (await FileSystem.getInfoAsync(DB_PATH)).size
      if (copiedSize !== assetSize) {
        throw new Error("Database copy failed - size mismatch")
      }
      console.log("Database copied successfully")
    } catch (error) {
      console.log("Error copying database:", error)
    }
  }
}

async function searchGeonames(cityName) {
  console.log("Opening database at:", DB_PATH)

  // Verify database exists
  const dbInfo = await FileSystem.getInfoAsync(DB_PATH)
  if (!dbInfo.exists) {
    throw new Error("Database file not found")
  }

  const db = await SQLite.openDatabaseAsync(DB_PATH)

  try {
    // Verify database connection
    await db.execAsync("PRAGMA quick_check;")

    // Use parameterized query with proper escaping
    const sanitizedInput = cityName.replace(/[%_]/g, "\\$&")
    const result = await db.getFirstAsync(
      `SELECT name, latitude, longitude 
         FROM geonames 
         WHERE name LIKE ? ESCAPE '\\' COLLATE NOCASE 
         LIMIT 1;`,
      [`%${sanitizedInput}%`]
    )

    return result
  } catch (error) {
    console.error("Database error:", error)
    throw error
  } finally {
    await db.closeAsync()
  }
}

export { copyDatabase, searchGeonames }
