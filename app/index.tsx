import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Box } from "@/components/Box";
import { ButtonWithContent } from "@/components/ButtonWithContent";
import { Label } from "@/components/Label";
import { useTheme } from "@/hooks/useTheme";
import { HueWheel } from "../components/HueWheel";
import NewTripScreen from "./new-trip-modal";

export default function HomeScreen() {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Box
        style={[
          styles.container,
          {
            padding: theme.padding.l,
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
              gap: theme.gaps.m,
            },
          ]}
        >
          <ButtonWithContent
            style={{
              flex: 1 / 2,
            }}
            onPress={() => setModalVisible(true)}
          >
            <Label>Start new trip</Label>
          </ButtonWithContent>
          <ButtonWithContent
            style={{
              flex: 1 / 2,
            }}
          >
            <Label>Open gallery</Label>
          </ButtonWithContent>
        </View>
      </Box>
      <NewTripScreen visible={modalVisible} setVisible={setModalVisible} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
  buttonWrapper: {
    flex: 1 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    textAlign: "center",
  },
});
