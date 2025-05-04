import { HStack, Image, Text, Spacer, Box } from "@chakra-ui/react";
import logo from "../assets/chess_logo.jpg";
import SearchGames from "./NavBar/Search";
import { ColorModeSwitch } from "./NavBar/ColorModeButton";
import { UserMenu } from "./NavBar/UserMenu";
import { useUser } from "../context/UserContext";

interface NavBarProps {
  onSearch: (title: string) => void; // Callback to handle search input
}

const NavBar = ({ onSearch }: NavBarProps) => {
  const { username } = useUser(); //Loading username from context
  return (
    <HStack padding="10px" alignItems="center">
      {/* Logo */}
      <Image src={logo} boxSize="60px" borderRadius={10} />

      {/* App Title */}
      <Text fontSize="2xl" fontWeight="bold">
        Optigame
      </Text>

      {/* Username */}
      <Text>
        Welcome, {username}!
      </Text>

      {/* Spacer to push Search to the center */}
      <Spacer />

      {/* Search Form */}
      <Box flex="1" maxW="600px" textAlign="left">
        <SearchGames onSearch={onSearch} />
      </Box>

      {/* Spacer to push ColorModeButton and UserMenu to the right */}
      <Spacer />

      {/* Color Mode Button */}
      <ColorModeSwitch />

      {/* User Menu */}
      <UserMenu />
    </HStack>
  );
};

export default NavBar;
