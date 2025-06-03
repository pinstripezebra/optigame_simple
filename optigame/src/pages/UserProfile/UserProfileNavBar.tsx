import { HStack, Image, Text, Spacer, Box } from "@chakra-ui/react";
import logo from "../../assets/chess_logo.jpg";
import { ColorModeSwitch } from "../../components/NavBar/ColorModeButton";
import { UserMenu } from "../../components/NavBar/UserMenu";
import { HomeButton } from "../../components/NavBar/HomeButton";
import { useUser } from "../../context/UserContext";
import { RecommendedButton } from "../../components/NavBar/RecommendedButton";

const UserNavBar = () => {
  const { username } = useUser(); //Loading username from context
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

export default UserNavBar;