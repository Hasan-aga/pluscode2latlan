import { Tabs } from "expo-router"
import React from "react"
import { Platform } from "react-native"

import { HapticTab } from "@/components/HapticTab"
import { IconSymbol } from "@/components/ui/IconSymbol"
import TabBarBackground from "@/components/ui/TabBarBackground"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff"
          },
          default: {
            backgroundColor: colorScheme === "dark" ? "#000000" : "#ffffff"
          }
        })
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="info.circle.fill" color={color} />
          )
        }}
      />
    </Tabs>
  )
}
