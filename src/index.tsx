import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { type FC, useEffect } from "react";
import "react-native-reanimated";
import { registerRootComponent } from "expo";
import { useNavigation } from "./hooks/useNavigation";
import { HomeScreen } from "./screens/home";

void SplashScreen.preventAutoHideAsync().catch(() => {});

const Router: FC = () => {
  const { currentScreen } = useNavigation();

  const mapping: Record<string, React.ReactNode> = {
    home: <HomeScreen />,
  };

  return mapping[currentScreen] ?? mapping.home;
};

const App = () => {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <Router />
      <StatusBar style="auto" />
    </>
  );
};

export default registerRootComponent(App);
