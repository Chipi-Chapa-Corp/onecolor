import type { ViewProps } from "react-native";
import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export const Box: React.FC<ThemedViewProps> = ({
  style,
  lightColor,
  darkColor,
  ...otherProps
}) => {
  const theme = useTheme();

  return (
    <View
      style={[{ backgroundColor: theme.colors.background }, style]}
      {...otherProps}
    />
  );
};
