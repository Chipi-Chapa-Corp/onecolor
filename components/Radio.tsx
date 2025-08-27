import { TouchableOpacity, View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Label } from "./Label";
import { ButtonWithContent } from "./ButtonWithContent";

export type RadioProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

function OptionButton({
  value,
  selected,
  onPress,
}: {
  value: string;
  selected: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <ButtonWithContent
      style={{
        backgroundColor: selected ? theme.colors.tint : theme.colors.background,
      }}
      onPress={onPress}
    >
      <Label
        style={{
          color: selected ? theme.colors.background : theme.colors.tint,
        }}
      >
        {value}
      </Label>
    </ButtonWithContent>
  );
}

export function Radio({ options, value, onChange }: RadioProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: theme.gaps.s,
      }}
    >
      {options.map((opt) => (
        <OptionButton
          key={opt}
          value={opt}
          selected={value === opt}
          onPress={() => onChange(opt)}
        />
      ))}
    </View>
  );
}
