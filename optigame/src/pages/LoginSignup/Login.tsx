import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Stack,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  Link,
  HStack,
  Text,
  Image,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import api from "../../services/api-client";
import { useUser } from "../../context/UserContext";
import backgroundImage from "../../assets/background4.jpg";
import logo from "../../assets/chess_logo.jpg";

export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: number;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  const { setUsername } = useUser();
  const [localUsername, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await api.get<User[]>("/v1/users", {
        params: { username: localUsername, password },
      });

      if (response.data.length > 0) {
        setUsername(localUsername); // Set the global username
        navigate("/"); // Navigate to the base "/" route
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      backgroundImage={`url(${backgroundImage})`} // Set the background image
      backgroundSize="cover" // Ensure the image covers the entire container
      backgroundPosition="center" // Center the image
    >
      {/* Header Section */}
      <Box position="absolute" top="0" left="0" padding="10px">
        <HStack alignItems="center">
          {/* Logo */}
          <Image src={logo} boxSize="60px" borderRadius={10} />

          {/* App Title */}
          <Text fontSize="2xl" fontWeight="bold" color="teal.700">
            Optigame
          </Text>
        </HStack>
      </Box>

      <Stack
        spacing={4}
        p="1rem"
        backgroundColor="rgba(255, 255, 255, 0.9)" // Semi-transparent white background
        boxShadow="md"
        borderRadius="md"
        width="400px"
      >
        {/* Avatar and Heading */}
        <Stack alignItems="center">
          <Avatar bg="teal.500" />
          <Heading color="teal.600">Welcome</Heading>
        </Stack>
        <form onSubmit={handleLogin}>
          {/* Username */}
          <FormControl>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<FaUserAlt color="gray.300" />}
              />
              <Input
                type="text"
                placeholder="username"
                value={localUsername} // Bind input value to username state
                onChange={(e) => setLocalUsername(e.target.value)} // Update username state on input change
              />
            </InputGroup>
          </FormControl>

          {/* Password */}
          <FormControl>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                color="gray.300"
                children={<FaLock color="gray.300" />}
              />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password} // Bind input value to password state
                onChange={(e) => setPassword(e.target.value)} // Update password state on input change
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormHelperText textAlign="right">
              <Link>forgot password?</Link>
            </FormHelperText>
          </FormControl>

          {/* Login Button */}
          <Button
            borderRadius={0}
            type="submit" // Ensure the button triggers form submission
            variant="solid"
            colorScheme="teal"
            width="full"
          >
            Login
          </Button>
        </form>
        {/* Sign-Up Link */}
        <Stack alignItems="center">
          <Box>
            New to us?{" "}
            <Link color="teal.500" onClick={() => navigate("/Signup")}>
              Sign Up
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Login;
