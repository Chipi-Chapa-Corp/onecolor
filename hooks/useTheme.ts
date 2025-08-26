import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { useColorScheme } from "react-native";

export function useTheme() {
    const theme = useColorScheme() ?? "light";

    return {
        colors: Colors[theme],
        ...Spacing
    }
}
