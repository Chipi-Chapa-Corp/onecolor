import { useTheme } from "@/hooks/useTheme";
import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();
  const backgroundColor = theme.colors.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
