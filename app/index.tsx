import { Button } from "@react-navigation/elements";
import { StyleSheet, View } from "react-native";
import { Box } from "@/components/Box";
import { Label } from "@/components/Label";
import { useTheme } from "@/hooks/useTheme";
import { HueWheel } from "../components/HueWheel";

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
      <HueWheel
        sections={[
          "pink",
          "red",
          "orange",
          "yellow",
          "green",
          "cyan",
          "blue",
          "purple",
        ]}
        sectionColors={{
          pink: "#FF647E",
          red: "#ff0000",
          orange: "#ff7f00",
          yellow: "#ffff00",
          green: "#00ff00",
          cyan: "#00BFFF",
          blue: "#0000ff",
          purple: "#7f00ff",
        }}
        onSectionClick={(section: string) => {
          alert(`Section clicked: ${section}`);
        }}
      />
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
