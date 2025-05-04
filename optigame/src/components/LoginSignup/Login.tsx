import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./LoginSignup.css";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { CiUser } from "react-icons/ci";
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
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import api from "../../services/api-client";

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

  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password

  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Pass the username and password from the state to the API
      const response = await api.get<User[]>("/v1/users", {
        params: { username, password },
      });

      console.log(response.data); // Handle the returned User objects as needed

      // Check if the returned array has a length greater than 0
      if (response.data.length > 0) {
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
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleLogin}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
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
                    value={username} // Bind input value to username state
                    onChange={(e) => setUsername(e.target.value)} // Update username state on input change
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
            </Stack>
          </form>
        </Box>
      </Stack>

      <Box>
        New to us?{" "}
        <Link color="teal.500" href="#">
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};

export default Login;
