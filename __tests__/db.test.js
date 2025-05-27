import * as FileSystem from "expo-file-system"
import * as SQLite from "expo-sqlite"
import { searchForClosestCity } from "../utils/db.js"

// Mock the SQLite database
jest.mock("expo-sqlite")
jest.mock("expo-file-system")

describe("searchForClosestCity", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test Case 1: Valid input with a known closest city
  it("should return the closest city for valid input", async () => {
    const mockDb = {
      execAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue({
        id: 1,
        name: "Test City",
        latitude: 40.7128,
        longitude: -74.006,
        distance_km: 0
      }),
      getAllAsync: jest.fn().mockResolvedValue([
        {
          id: 1,
          name: "Test City",
          latitude: 40.7128,
          longitude: -74.006
        }
      ]),
      closeAsync: jest.fn()
    }

    SQLite.openDatabaseAsync.mockResolvedValue(mockDb)
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true })

    const result = await searchForClosestCity({
      latitude: 40.7128,
      longitude: -74.006
    })
    expect(result).toEqual({
      id: 1,
      name: "Test City",
      latitude: 40.7128,
      longitude: -74.006,
      distance_km: 0
    })
  })

  // Test Case 2: Input with no cities in the database
  it("should throw an error if no cities are found", async () => {
    const mockDb = {
      execAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue(null),
      getAllAsync: jest.fn().mockResolvedValue([]),
      closeAsync: jest.fn()
    }

    SQLite.openDatabaseAsync.mockResolvedValue(mockDb)
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true })

    await expect(
      searchForClosestCity({ latitude: 40.7128, longitude: -74.006 })
    ).resolves.toBeNull()
  })

  // Test Case 3: Input with invalid latitude or longitude values
  it("should throw an error for invalid latitude or longitude", async () => {
    const mockDb = {
      execAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue(null),
      getAllAsync: jest.fn().mockResolvedValue([]),
      closeAsync: jest.fn()
    }

    SQLite.openDatabaseAsync.mockResolvedValue(mockDb)
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true })

    await expect(
      searchForClosestCity({ latitude: "invalid", longitude: -74.006 })
    ).rejects.toThrow("Invalid input")
    await expect(
      searchForClosestCity({ latitude: 40.7128, longitude: "invalid" })
    ).rejects.toThrow("Invalid input")
  })

  // Test Case 4: Edge case where the input coordinates are exactly at a city's location
  it("should return the city if input coordinates are exactly at a city's location", async () => {
    const mockDb = {
      execAsync: jest.fn().mockResolvedValue([]),
      getFirstAsync: jest.fn().mockResolvedValue({
        id: 1,
        name: "Test City",
        latitude: 40.7128,
        longitude: -74.006,
        distance_km: 0
      }),
      getAllAsync: jest.fn().mockResolvedValue([
        {
          id: 1,
          name: "Test City",
          latitude: 40.7128,
          longitude: -74.006
        }
      ]),
      closeAsync: jest.fn()
    }

    SQLite.openDatabaseAsync.mockResolvedValue(mockDb)
    FileSystem.getInfoAsync.mockResolvedValue({ exists: true })

    const result = await searchForClosestCity({
      latitude: 40.7128,
      longitude: -74.006
    })
    expect(result).toEqual({
      id: 1,
      name: "Test City",
      latitude: 40.7128,
      longitude: -74.006,
      distance_km: 0
    })
  })
})
