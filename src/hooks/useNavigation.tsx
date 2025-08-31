import { createContext, useContext, useState } from "react";

type NavigationContextType = {
  currentScreen: string;
  navigate: (screen: string) => void;
};

const NavigationContext = createContext<NavigationContextType>(
  {} as unknown as NavigationContextType,
);

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentScreen, setCurrentScreen] = useState("home");

  return (
    <NavigationContext.Provider
      value={{ currentScreen, navigate: setCurrentScreen }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
