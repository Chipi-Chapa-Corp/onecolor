import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Box } from "@/components/Box";
import { ButtonWithContent } from "@/components/ButtonWithContent";
import { Divider } from "@/components/Divider";
import { Label } from "@/components/Label";
import { Radio } from "@/components/Radio";
import { useTheme } from "@/hooks/useTheme";

type ModalProps = {
  visible: boolean;
  setVisible(visible: boolean): void;
};

export default function NewTripScreen({ visible, setVisible }: ModalProps) {
  const theme = useTheme();
  const [tripType, setTripType] = useState("single");

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
      presentationStyle="pageSheet"
      transparent={false}
    >
      <Box
        style={[
          styles.container,
          {
            padding: theme.padding.l,
            gap: theme.gaps.xl,
          },
        ]}
      >
        <Label type="title">New trip</Label>
        <Divider />
        <Radio
          value={tripType}
          onChange={setTripType}
          options={["single", "group"]}
        />
        <Divider />
        <Divider />
        <View
          style={[
            styles.buttonsContainer,
            {
              gap: theme.gaps.s,
            },
          ]}
        >
          <ButtonWithContent
            style={{
              flex: 1 / 2,
            }}
            onPress={() => setVisible(false)}
          >
            <Label>Cancel</Label>
          </ButtonWithContent>
          <ButtonWithContent
            style={{
              flex: 1 / 2,
            }}
            onPress={() => setVisible(false)}
          >
            <Label>Start trip</Label>
          </ButtonWithContent>
        </View>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    height: "100%",
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
