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

      // First, make sure the asset is downloaded locally
      if (!asset.downloaded) {
        await Asset.loadAsync(require(`../assets/db/${DB_NAME}`))
      }

      // Now use localUri instead of uri for iOS
      const sourceUri = asset.localUri || asset.uri

      await FileSystem.copyAsync({
        from: sourceUri,
        to: DB_PATH
      })

      // Verify the copy worked
      const copiedInfo = await FileSystem.getInfoAsync(DB_NAME)
      if (!copiedInfo.exists || copiedInfo.size === 0) {
        throw new Error("Database copy failed - file is missing or empty")
      }

      console.log("Database copied successfully")
    } catch (error) {
      console.log("Error copying database:", error)
    }
  }
}

async function checkDbTables() {
  try {
    console.log("Opening database at:", DB_NAME)
    const db = await SQLite.openDatabaseAsync(DB_NAME)

    // Log the database object to see what we're working with
    console.log("Database object:", JSON.stringify(db))

    // Use execAsync with more debugging
    const result = await db.execAsync(
      "SELECT name FROM sqlite_master WHERE type='table';"
    )

    console.log("Raw result:", result)
    console.log("Result type:", typeof result)

    if (result) {
      if (Array.isArray(result)) {
        console.log("Result is array with length:", result.length)
        result.forEach((item, index) => {
          console.log(`Table ${index}:`, item)
        })
      } else if (typeof result === "object") {
        console.log("Result keys:", Object.keys(result))
      }
    } else {
      console.log("Result is undefined or null - database might be empty")

      // Try a different query to check if database is functional
      try {
        const testResult = await db.execAsync("PRAGMA integrity_check;")
        console.log("Integrity check result:", testResult)
      } catch (err) {
        console.log("Database integrity check failed:", err)
      }
    }

    await db.closeAsync()

    // Verify the file exists and has content
    const fileInfo = await FileSystem.getInfoAsync(DB_NAME)
    console.log("DB file info:", fileInfo)
  } catch (error) {
    console.log("Error checking database tables:", error)
  }
}

async function searchGeonames(cityName) {
  console.log("Opening database at:", DB_PATH)

  // Verify database exists
  const dbInfo = await FileSystem.getInfoAsync(DB_PATH)
  if (!dbInfo.exists) {
    throw new Error("Database file not found")
  }

  const db = await SQLite.openDatabaseAsync(DB_NAME)

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

export { checkDbTables, copyDatabase, searchGeonames }
