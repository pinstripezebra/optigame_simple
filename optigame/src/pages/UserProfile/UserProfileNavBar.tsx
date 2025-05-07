import { HStack, Image, Text, Spacer, Box } from "@chakra-ui/react";
import logo from "../../assets/chess_logo.jpg";
import { ColorModeSwitch } from "../../components/NavBar/ColorModeButton";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";


const UserNavBar = () => {
  const { username } = useUser(); // Loading username from context
  const navigate = useNavigate(); // Initialize useNavigate
  return (
    <HStack padding="10px" alignItems="center">
      {/* Logo */}
      <Image src={logo} boxSize="60px" borderRadius={10} />

      {/* App Title */}
      <Text fontSize="2xl" fontWeight="bold">
        Optigame
      </Text>

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
    </HStack>
  );
};

export default UserNavBar;
