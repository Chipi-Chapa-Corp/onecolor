import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Box } from "@/components/Box";
import { Label } from "@/components/Label";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Box style={styles.container}>
        <Label type="title">This screen does not exist.</Label>
        <Link href="/" style={styles.link}>
          <Label type="link">Go to home screen!</Label>
        </Link>
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
