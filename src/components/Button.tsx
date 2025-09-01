import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleSheet,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Label } from "./Label";

type ButtonProps = {
  style?: ViewStyle;
  labelStyle?: TextStyle;
  label?: string;
  onPress?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
  style,
  labelStyle,
  label,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          padding: theme.padding.m,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.skeuo.innerContent,
          boxShadow: `
          -10px -10px 40px -10px ${theme.colors.skeuo.outerLight},
          10px 10px 20px 0 ${theme.colors.skeuo.outerDark}
          `,
          borderLeftWidth: 1,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: theme.colors.skeuo.outerLight,
          borderTopColor: theme.colors.skeuo.outerLight,
          borderRightColor: theme.colors.skeuo.outerLight,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[theme.colors.skeuo.innerLight, "#23242A"]}
        start={{ x: 0, y: -5 }}
        end={{ x: 1, y: 5 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <Label style={labelStyle}>{label}</Label>
    </Pressable>
  );
};
