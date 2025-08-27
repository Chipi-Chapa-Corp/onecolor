import type { PropsWithChildren } from "react";
import { TouchableOpacity, type ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";

type ButtonProps = {
  style?: ViewStyle;
  onPress?: () => void;
};

export function ButtonWithContent({
  style,
  onPress,
  children,
}: PropsWithChildren<ButtonProps>) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        {
          padding: theme.padding.s,
          borderRadius: theme.round.m,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.tabIconDefault,
        },
        style,
      ]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}
