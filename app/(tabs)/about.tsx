import { StyleSheet } from "react-native"

import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme.web"
import { Link } from "expo-router"

export default function TabTwoScreen() {
  const colorScheme = useColorScheme()
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
          name="info.circle.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About</ThemedText>
      </ThemedView>
      <ThemedText>
        This app was created by{" "}
        <Link href="https://github.com/Hasan-aga">
          <ThemedText type="link">Hasan Aga</ThemedText>
        </Link>
        .
      </ThemedText>
      <ThemedText>
        Provided under MIT license, you can get the source code from{" "}
        <Link href="https://github.com/Hasan-aga/pluscode2latlan">
          <ThemedText type="link">GitHub</ThemedText>
        </Link>
      </ThemedText>
      <ThemedText>
        This app can convert a plus code to latitude and longitude.
      </ThemedText>
      <ThemedText>It can handle both short and long plus codes.</ThemedText>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    opacity: 0.2
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8
  }
})
