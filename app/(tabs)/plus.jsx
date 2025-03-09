import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import React, { useState } from "react"
import {
  Button,
  Clipboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import OpenLocationCode from "../../assets/openlocationlocal"

const PlusCodeDecoder = () => {
  const [plusCode, setPlusCode] = useState("")
  const [coordinates, setCoordinates] = useState(null)
  const [error, setError] = useState("")
  const [isShortResult, setIsShortResult] = useState(null)
  const [isValidResult, setIsValidResult] = useState(null)
  const [angleCheckResult, setAngleCheckResult] = useState(null)

  const handleDecode = () => {
    try {
      // Baghdad coordinates as reference point for Iraq
      const IRAQ_LAT = 33.3152;
      const IRAQ_LNG = 44.3661;

      let codeToUse = plusCode;
      const isShortCode = !OpenLocationCode.isFull(plusCode);
      setIsShortResult(isShortCode);
      
      // If it's a short code, recover the full code using Iraq as reference
      if (isShortCode && OpenLocationCode.isValid(plusCode)) {
        codeToUse = OpenLocationCode.recoverNearest(plusCode, IRAQ_LAT, IRAQ_LNG);
      }

      const decoded = OpenLocationCode.decode(codeToUse);
      setCoordinates({
        latitude: decoded.latitudeCenter,
        longitude: decoded.longitudeCenter
      });
      
      setIsValidResult(OpenLocationCode.isValid(plusCode));
      setAngleCheckResult(OpenLocationCode.isValidLongitude(plusCode));
      setError("");
    } catch (err) {
      setError(`Error \n${err}`);
      setCoordinates(null);
      setIsShortResult(null);
      setIsValidResult(null);
      setAngleCheckResult(null);
    }
  }

  const handlePaste = async () => {
    const text = await Clipboard.getString()
    setPlusCode(text)
  }

  const handleCopy = () => {
    if (coordinates) {
      Clipboard.setString(
        `Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}`
      )
    }
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
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
            style={styles.input}
            value={plusCode}
            onChangeText={setPlusCode}
            placeholder="e.g., 7FG8VQC9+G6"
          />
          <TouchableOpacity onPress={handlePaste} style={styles.pasteButton}>
            <ThemedText>Paste</ThemedText>
          </TouchableOpacity>
        </View>
        <Button title="Decode" onPress={handleDecode} />
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        {coordinates && (
          <View style={styles.resultContainer}>
            <View style={styles.resultTextContainer}>
              <ThemedText>Latitude: {coordinates.latitude}</ThemedText>
              <ThemedText>Longitude: {coordinates.longitude}</ThemedText>
            </View>
            <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
              <ThemedText>Copy</ThemedText>
            </TouchableOpacity>
          </View>
        )}
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
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10
  },
  pasteButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#ccc"
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  resultTextContainer: {
    flex: 2
  },
  copyButton: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: "#ccc",
    alignItems: "center"
  },
  result: {
    marginTop: 20
  },
  error: {
    color: "red",
    marginTop: 20
  }
})

export default PlusCodeDecoder
