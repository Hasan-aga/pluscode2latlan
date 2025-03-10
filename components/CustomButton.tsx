import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import React from "react"
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from "react-native"
import { ThemedText } from "./ThemedText"

interface CustomButtonProps {
  onPress: () => void
  title: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<ViewStyle>
  variant?: "default" | "cancel"
}

export const CustomButton = ({
  onPress,
  title,
  style,
  textStyle,
  variant = "default"
}: CustomButtonProps) => {
  const colorScheme = useColorScheme()

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor:
            variant === "default"
              ? Colors[colorScheme || "light"].background
              : "transparent",
          borderColor: Colors[colorScheme || "light"].tint
        },
        variant === "cancel" && styles.cancelButton,
        style
      ]}
      onPress={onPress}
    >
      <ThemedText>{title}</ThemedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
    borderWidth: 1
  },
  cancelButton: {
    borderBottomWidth: 0,
    backgroundColor: "transparent"
  },
  text: {
    fontSize: 16
  }
})
