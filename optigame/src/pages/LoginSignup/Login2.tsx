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
import backgroundImage from "../../assets/background4.jpg";
import logo from "../../assets/chess_logo.jpg";

// setting user context when they login
import { useUser } from "../../context/UserContext";
import { useUserGames } from "../../context/UserGamesContext";


export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: number;
}

export interface UserGame {
  id: string;
  username: string;
  asin: string;
}

function Login() {

    // State for username, password, and error message
    const [localUsername, setLocalUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for loading spinner
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUsername } = useUser();
    const handleShowClick = () => setShowPassword(!showPassword);

    // validation form to ensure username and password are not blank
    const validateForm = () => {
        if (!localUsername.trim() || !password.trim()) {
            setError("Username and password cannot be blank.");
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        
        const formDetails = new URLSearchParams();
        formDetails.append("username", localUsername);
        formDetails.append("password", password);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formDetails,
            });
            setLoading(false);

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.access_token);
                console.log("Token received:", data.access_token);
                setUsername(localUsername);
                navigate("/home");
            } else {
                const errorData = await response.json();
                setError(errorData.detail || "Authentication Failed. Please try again.");
            }
        } catch (error) {
            setLoading(false);
            setError("An error occurred while trying to log in. Please try again later.")
        }
      
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Box
                    minH="100vh"
                    backgroundImage={`url(${backgroundImage})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                >
                    <Flex align="center" justify="center" height="100vh">
                        <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
                            <Stack align="center">
                                <Avatar size="2xl" src={logo} />
                                <Heading fontSize="4xl">Welcome to OptiGame</Heading>
                                <Text fontSize="lg" color="gray.600">
                                    Please login to continue
                                </Text>
                            </Stack>
                            <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
                                {error && (
                                    <Text color="red.500" mb={4}>
                                        {error}
                                    </Text>
                                )}
                                <Stack spacing={4}>
                                    <FormControl id="username">
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents="none"
                                                children={<FaUserAlt color="gray.300" />}
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Username"
                                                value={localUsername}
                                                onChange={(e) => setLocalUsername(e.target.value)}
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="password">
                                        <InputGroup>
                                            <InputLeftElement
                                                pointerEvents="none"
                                                children={<FaLock color="gray.300" />}
                                            />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <InputRightElement width="4.5rem">
                                                <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                                                    {showPassword ? "Hide" : "Show"}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                    <HStack justifyContent="space-between">
                                        <Link color="blue.400">Forgot password?</Link>
                                    </HStack>
                                    <Button
                                        isLoading={loading}
                                        loadingText="Logging in..."
                                        colorScheme="blue"
                                        variant="solid"
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </Flex>
                </Box>
            </form>
        </div>
    );
}

export default Login;