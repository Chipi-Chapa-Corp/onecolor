import { Pressable, type ViewStyle } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Label } from "./Label";

type ButtonProps = {
  style?: ViewStyle;
  label?: string;
  onPress?: () => void;
};

export const Button: React.FC<ButtonProps> = ({ style, label, onPress }) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          padding: theme.padding.m,
          borderRadius: theme.round.m,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.skeuo.innerContent,
          boxShadow: `
          20px 15px 40px 0 ${theme.colors.skeuo.outerDark},
          10px 10px 40px 0 ${theme.colors.skeuo.innerDark} inset,
            -10px -5px 20px 0 ${theme.colors.skeuo.innerContent}
          `,
        },
        style,
      ]}
    >
      <Label>{label}</Label>
    </Pressable>
  );
};
