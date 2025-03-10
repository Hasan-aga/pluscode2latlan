import { CustomButton } from "@/components/CustomButton"
import { MapsModal } from "@/components/MapsModal"
import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import React, { useState } from "react"
import { Clipboard, StyleSheet, TextInput, View } from "react-native"
import OpenLocationCode from "../../assets/openlocationlocal"
import { searchGeonames } from "../../utils/db"

const PlusCodeDecoder = () => {
  const colorScheme = useColorScheme()
  const [plusCode, setPlusCode] = useState("")
  const [coordinates, setCoordinates] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [error, setError] = useState("")
  const [isShortResult, setIsShortResult] = useState(null)
  const [isValidResult, setIsValidResult] = useState(null)
  const [angleCheckResult, setAngleCheckResult] = useState(null)

  const extractLocationInfo = (input) => {
    const parts = input.split(",").map((part) => part.trim())
    if (parts.length > 1) {
      return {
        plusCode: parts[0],
        locationParts: parts.slice(1)
      }
    }
    return {
      plusCode: input,
      locationParts: []
    }
  }

  const fetchGeoNamesCoordinates = async (locationPart) => {
    try {
      const result = await searchGeonames(locationPart)
      if (result) {
        return result
      }
      return null
    } catch (error) {
      console.error("Error searching Geonames:", error)
      return null
    }
  }

  const findCityCoordinates = async (locationParts) => {
    for (const part of locationParts) {
      const coords = await fetchGeoNamesCoordinates(part)
      if (coords) {
        return coords
      }
    }
    throw new Error("No valid city found in the location string")
  }

  const handleDecode = async () => {
    try {
      const { plusCode: code, locationParts } = extractLocationInfo(plusCode)
      const isShortCode = !OpenLocationCode.isFull(code)
      setIsShortResult(isShortCode)

      let codeToUse = code
      // If it's a short code and we have location parts, try to find a valid city
      if (isShortCode && OpenLocationCode.isValid(code)) {
        if (locationParts.length === 0) {
          throw new Error(
            'Location information is required for short plus codes (e.g., "VX63+22F, Qazi Mohammad Road, Duhok")'
          )
        }

        const referenceCoords = await findCityCoordinates(locationParts)
        codeToUse = OpenLocationCode.recoverNearest(
          code,
          referenceCoords.latitude,
          referenceCoords.longitude
        )
      }

      const decoded = OpenLocationCode.decode(codeToUse)
      setCoordinates({
        latitude: decoded.latitudeCenter,
        longitude: decoded.longitudeCenter
      })

      setIsValidResult(OpenLocationCode.isValid(code))
      setAngleCheckResult(OpenLocationCode.isValidLongitude(code))
      setError("")
    } catch (err) {
      setError(`Error \n${err}`)
      setCoordinates(null)
      setIsShortResult(null)
      setIsValidResult(null)
      setAngleCheckResult(null)
    }
  }

  const handlePaste = async () => {
    const text = await Clipboard.getString()
    setPlusCode(text)
  }

  const handleCopy = () => {
    if (coordinates) {
      Clipboard.setString(`${coordinates.latitude},${coordinates.longitude}`)
    }
  }

  const [isMapModalVisible, setIsMapModalVisible] = useState(false)

  const handleOpenMaps = () => {
    if (!coordinates) return
    setIsMapModalVisible(true)
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.background,
        dark: Colors.dark.background
      }}
      headerImage={
        <IconSymbol
          size={310}
          color={Colors[colorScheme || "light"].icon}
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ThemedText style={styles.label} type="default">
          Enter Plus Code:
        </ThemedText>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: Colors[colorScheme || "light"].text,
                backgroundColor: Colors[colorScheme || "light"].background,
                borderColor: Colors[colorScheme || "light"].tint
              }
            ]}
            value={plusCode}
            onChangeText={setPlusCode}
            placeholder="e.g., 95FH+WMV, Mosul"
            placeholderTextColor={Colors[colorScheme || "light"].icon}
          />

          <CustomButton title="paste" onPress={handlePaste} />
        </View>
        <CustomButton title="Decode" onPress={handleDecode} />
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        <View style={{ height: 50 }} />

        {coordinates && (
          <View style={styles.resultContainer}>
            <View style={styles.resultTextContainer}>
              <ThemedText>Latitude,</ThemedText>
              <ThemedText>Longitude</ThemedText>
            </View>
            <View style={styles.resultTextContainer}>
              <ThemedText>{coordinates.latitude}</ThemedText>
              <ThemedText>{coordinates.longitude}</ThemedText>
            </View>
            <View style={{ height: 20 }} />

            <View style={styles.buttonGroup}>
              <CustomButton title="Copy" onPress={handleCopy} />
              <CustomButton title="Open in Maps" onPress={handleOpenMaps} />
            </View>
          </View>
        )}
        <View style={{ height: 50 }} />

        {!isShortResult !== null && (
          <ThemedText style={styles.result}>
            Is Short: {isShortResult ? "Yes" : "No"}
          </ThemedText>
        )}
        {!isValidResult !== null && (
          <ThemedText style={styles.result}>
            Is Valid: {isValidResult ? "Yes" : "No"}
          </ThemedText>
        )}
        {!angleCheckResult !== null && (
          <ThemedText style={styles.result}>
            Angle Check: {angleCheckResult ? "Passed" : "Failed"}
          </ThemedText>
        )}
      </ThemedView>
      {coordinates && (
        <MapsModal
          visible={isMapModalVisible}
          onClose={() => setIsMapModalVisible(false)}
          coordinates={coordinates}
        />
      )}
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  label: {
    marginBottom: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  input: {
    flex: 1,
    height: 40,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    marginRight: 10
  },
  pasteButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 5
  },
  resultContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: 20
  },
  resultTextContainer: {
    flexDirection: "row",
    gap: 8
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    gap: 8
  },
  copyButton: {
    padding: 8,
    borderRadius: 5
  },
  mapButton: {
    padding: 8,
    borderRadius: 5
  },
  result: {
    marginTop: 20
  },
  error: {
    color: "#FF0000",
    marginTop: 20
  },
  headerImage: {
    opacity: 0.2
  }
})

export default PlusCodeDecoder
