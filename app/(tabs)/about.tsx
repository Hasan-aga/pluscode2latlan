import { StyleSheet } from "react-native"

import ParallaxScrollView from "@/components/ParallaxScrollView"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { Link } from "expo-router"

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
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
        Can be used to convert a plus code to latitude and longitude.
      </ThemedText>
      <ThemedText>Can handle both short and long plus codes.</ThemedText>
    </ParallaxScrollView>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute"
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8
  }
})
