import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
    </ThemedView>
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
