import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import "react-native-reanimated"

import { useColorScheme } from "@/hooks/useColorScheme"
import { checkDbTables, copyDatabase } from "@/utils/db"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  })

  useEffect(() => {
    const initializeApp = async () => {
      if (loaded) {
        try {
          // Step 1: Copy the database
          await copyDatabase()

          // Step 2: Check the database tables
          await checkDbTables()

          // Step 3: Hide the splash screen after everything is ready
          await SplashScreen.hideAsync()
        } catch (error) {
          console.error("Error during initialization:", error)
          // Still hide splash screen even if there was an error
          await SplashScreen.hideAsync()
        }
      }
    }

    // Call the async function
    initializeApp()
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DefaultTheme : DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
