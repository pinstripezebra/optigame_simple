import { HStack, Image, Text, Spacer, Box } from "@chakra-ui/react";
import logo from "../assets/chess_logo.jpg";
import SearchGames from "./NavBar/Search";
import { ColorModeSwitch } from "./NavBar/ColorModeButton";
import { UserMenu } from "./NavBar/UserMenu";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
interface NavBarProps {
  onSearch: (title: string) => void; // Callback to handle search input
}

const NavBar = ({ onSearch }: NavBarProps) => {
  const { username } = useUser(); //Loading username from context
  const navigate = useNavigate(); // Initialize useNavigate
  return (
    <HStack padding="10px" alignItems="center">
      {/* Logo */}
      <Image src={logo} boxSize="60px" borderRadius={10} />

      {/* App Title */}
      <Text fontSize="2xl" fontWeight="bold">
        Optigame
      </Text>

      {/* Spacer to push Search to the center */}
      <Spacer />

      {/* Search Form */}
      <Box flex="1" maxW="600px" textAlign="left">
        <SearchGames onSearch={onSearch} />
      </Box>

      {/* Spacer to push ColorModeButton and UserMenu to the right */}
      <Spacer />

      {/* Username */}
      <Text fontWeight="bold">
        Welcome,{" "}
        <Text as="span" color="teal">
          {username}
        </Text>
      </Text>

      {/* Color Mode Button */}
      <ColorModeSwitch />

      {/* User Menu */}
      <UserMenu />
    </HStack>
  );
};

export default NavBar;
