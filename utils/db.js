import { Asset } from "expo-asset"
import * as FileSystem from "expo-file-system"
import * as SQLite from "expo-sqlite"
import { unzip } from "react-native-zip-archive"

const DB_NAME = "geonames.db"
const DB_PATH = FileSystem.documentDirectory + "SQLite/" + DB_NAME
const ZIPPED_DB_NAME = "geonames.zip"
const TEMP_ZIP_PATH = `${FileSystem.documentDirectory}temp_${ZIPPED_DB_NAME}`

async function unzipDatabaseUsingNative() {
  const { exists } = await FileSystem.getInfoAsync(DB_PATH)

  if (!exists) {
    try {
      console.log("Extracting zipped database...")

      // Create SQLite directory if it doesn't exist
      await FileSystem.makeDirectoryAsync(
        FileSystem.documentDirectory + "SQLite",
        { intermediates: true }
      )

      // Get the zip file from assets
      const asset = Asset.fromModule(require(`../assets/db/${ZIPPED_DB_NAME}`))
      console.log("Loading zipped database asset", asset)

      // Make sure the asset is downloaded locally
      await asset.downloadAsync()

      // Now we have a file URI we can work with
      if (!asset.localUri) {
        throw new Error("Could not get local URI for asset")
      }

      // Get the local URI of the zip file
      const zipUri = asset.localUri || asset.uri

      // First copy the zip to a temporary location (needs to be on the filesystem)
      await FileSystem.copyAsync({
        from: zipUri,
        to: TEMP_ZIP_PATH
      })

      // Extract directly to the SQLite directory
      const targetDir = FileSystem.documentDirectory + "SQLite"
      await unzip(TEMP_ZIP_PATH, targetDir)

      // Clean up the temporary zip file
      await FileSystem.deleteAsync(TEMP_ZIP_PATH)

      // Verify the extraction worked
      const extractedInfo = await FileSystem.getInfoAsync(DB_PATH)
      if (!extractedInfo.exists || extractedInfo.size === 0) {
        throw new Error("Database extraction failed - file is missing or empty")
      }

      console.log("Database extracted successfully")
    } catch (error) {
      console.log("Error extracting database:", error)
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
    const capitalizedInput =
      sanitizedInput.charAt(0).toUpperCase() + sanitizedInput.slice(1)
    const result = await db.getFirstAsync(
      `select g.name, g.latitude, g.longitude
      from geonames g
      join alternative_names a on g.id=a.geoname_id
      where g.name like ? or a.alternative_name like ?`,
      [`${sanitizedInput}`, `${sanitizedInput}`]
    )

    return result
  } catch (error) {
    console.error("Database error:", error)
    throw error
  } finally {
    await db.closeAsync()
  }
}

export { checkDbTables, searchGeonames, unzipDatabaseUsingNative }
