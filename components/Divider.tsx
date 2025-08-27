import { StyleSheet, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";

export function Divider() {
  const theme = useTheme();
  return <View style={[styles.line, { backgroundColor: theme.colors.tint }]} />;
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 2,
    opacity: 0.1,
  },
});
