import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./Button";

export type RadioProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

type OptionButtonProps = {
  value: string;
  selected: boolean;
  onPress: () => void;
};

const OptionButton: React.FC<OptionButtonProps> = ({
  value,
  selected,
  onPress,
}) => {
  const theme = useTheme();
  return (
    <Button
      style={{
        backgroundColor: selected ? theme.colors.tint : theme.colors.background,
      }}
      labelStyle={{
        color: selected ? theme.colors.background : theme.colors.tint,
      }}
      label={value}
      onPress={onPress}
    />
  );
};

export const Radio: React.FC<RadioProps> = ({ options, value, onChange }) => {
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
};
