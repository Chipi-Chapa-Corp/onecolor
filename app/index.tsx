import { StyleSheet } from "react-native";
import { Box } from "@/components/Box";
import { ThemedText } from "@/components/Label";

export default function HomeScreen() {
  return (
    <Box style={styles.titleContainer}>
      <ThemedText type="title">Welcome!</ThemedText>
    </Box>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    padding: 64,
    height: "100%",
    alignItems: "center",
    gap: 8,
  },
});
