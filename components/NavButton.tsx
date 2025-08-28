import { type Href, Link } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { ButtonWithContent } from "./ButtonWithContent";
import { Label } from "./Label";

type NavButtonProps = {
  link: Href;
  text: string;
};

export const NavButton: React.FC<NavButtonProps> = ({ link, text }) => {
  const theme = useTheme();

  return (
    <Link
      style={{
        flex: 1 / 2,
        textAlign: "center",
      }}
      href={link}
      asChild
    >
      <ButtonWithContent
        style={{ backgroundColor: theme.colors.tabIconDefault, width: "100%" }}
      >
        <Label>{text}</Label>
      </ButtonWithContent>
    </Link>
  );
};
