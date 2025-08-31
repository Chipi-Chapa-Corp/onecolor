import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/Button";
import { HueWheel } from "@/components/HueWheel/HueWheel";
import { Label } from "@/components/Label";
import { useTheme } from "@/hooks/useTheme";
import { NewTripScreen } from "./modal/new-trip";

export const HomeScreen = () => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <LinearGradient
        colors={[theme.colors.skeuo.outerLight, theme.colors.skeuo.outerDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
          sections={{
            pink: "#F458CD",
            red: "#FC5A5A",
            orange: "#FBA34B",
            yellow: "#FEFE56",
            green: "#58FC58",
            cyan: "#56D1FA",
            blue: "#5555FC",
            purple: "#A246FF",
          }}
          onSectionClick={(section: string) => {
            alert(`Section clicked: ${section}`);
          }}
        />
        <View style={[styles.buttonsContainer, { gap: theme.gaps.l }]}>
          <Button
            style={{
              flex: 1 / 2,
            }}
            label="Start new trip"
            onPress={() => setModalVisible(true)}
          />
          <Button
            style={{
              flex: 1 / 2,
            }}
            label="Open gallery"
            onPress={() => setModalVisible(true)}
          />
        </View>
      </LinearGradient>
      <NewTripScreen visible={modalVisible} setVisible={setModalVisible} />
    </>
  );
};

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
