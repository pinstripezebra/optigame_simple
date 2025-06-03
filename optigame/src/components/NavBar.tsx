import { HStack, Image, Text, Spacer, Box } from "@chakra-ui/react";
import logo from "../assets/chess_logo.jpg";
import SearchGames from "./NavBar/Search";
import { ColorModeSwitch } from "./NavBar/ColorModeButton";
import { UserMenu } from "./NavBar/UserMenu";
import { HomeButton } from "./NavBar/HomeButton";
import { RecommendedButton } from "./NavBar/RecommendedButton";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
interface NavBarProps {
  onSearch: (title: string) => void; // Callback to handle search input
}

const NavBar = ({ onSearch }: NavBarProps) => {
  const { username } = useUser(); //Loading username from context
  const navigate = useNavigate(); // Initialize useNavigate
  return (
    <Box
      bg="teal.50"
      px={4}
      py={2}
      boxShadow="sm"
      border="2px solid"
      borderColor="teal.100"
      borderRadius="md"
    >
      <HStack padding="10px" alignItems="center">
        {/* Logo and Titles */}
        <Box>
          <HStack>
            <Image src={logo} boxSize="60px" borderRadius={10} />
            <Text fontSize="2xl" fontWeight="bold">
              Optigame
            </Text>
          </HStack>
          <Text fontSize="sm">Finding your next great game starts here.</Text>
        </Box>

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
        <Box>
          <HomeButton />
        </Box>
        <Box>
          <RecommendedButton />
        </Box>
        {/* User Menu */}
        <Box>
          <UserMenu />
        </Box>
      </HStack>
    </Box>
  );
};

export default NavBar;
