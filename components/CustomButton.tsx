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
import { IconSymbol } from "./ui/IconSymbol"

interface CustomButtonProps {
  icon?: React.ComponentProps<typeof IconSymbol>["name"]
  onPress: () => void
  title: string
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  variant?: "default" | "cancel"
}

export const CustomButton = ({
  onPress,
  title,
  style,
  icon,
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
      {icon && (
        <IconSymbol
          name={icon}
          size={20}
          color={Colors[colorScheme || "light"].icon}
        />
      )}
      {title && <ThemedText style={textStyle}>{title}</ThemedText>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15, // Increased padding
    paddingHorizontal: 15, // Increased padding
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 150
  },
  cancelButton: {
    borderBottomWidth: 0,
    backgroundColor: "transparent"
  },
  text: {
    fontSize: 16
  }
})
