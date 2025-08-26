import { Button } from "@react-navigation/elements";
import { StyleSheet, View } from "react-native";
import { Box } from "@/components/Box";
import { HueWheel } from "@/components/HueWheel";
import { Label } from "@/components/Label";
import { useTheme } from "@/hooks/useTheme";

export default function HomeScreen() {
  const theme = useTheme();
  return (
    <Box
      style={[
        styles.titleContainer,
        {
          padding: theme.padding.xl,
          gap: theme.gaps.xl,
        },
      ]}
    >
      <Label type="title">Welcome!</Label>
      <HueWheel />
      <View
        style={[
          styles.buttonsContainer,
          {
            gap: theme.gaps.s,
          },
        ]}
      >
        <Button style={styles.button}>Start new trip</Button>
        <Button style={styles.button}>Open gallery</Button>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "column",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1 / 2,
  },
});
