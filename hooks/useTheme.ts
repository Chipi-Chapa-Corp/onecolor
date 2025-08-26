import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";

export function useTheme() {
  const theme = useColorScheme() ?? "light";

  return {
    colors: Colors[theme],
    ...Spacing,
  };
}
