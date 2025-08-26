import { StyleSheet, View } from "react-native";

export function HueWheel() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    height: "45%",
    aspectRatio: 1 / 1,
    alignItems: "center",
    backgroundColor: "red",
  },
});
