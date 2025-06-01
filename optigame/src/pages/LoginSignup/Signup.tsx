import { useState } from "react";
import "./LoginSignup.css";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { CiUser } from "react-icons/ci";
import { HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
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
  Image,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import backgroundImage from "../../assets/background4.jpg";
import logo from "../../assets/chess_logo.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleShowClick = () => setShowPassword(!showPassword);

  // Password validation function checks for one letter, one number, one special character, min 6 chars
  const isValidPassword = (pw: string) => {
    return /[A-Za-z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword(password)) {
      toast({
        title: "Password requirements not met",
        description:
          "Password must contain at least one letter, one number, and one special character.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
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
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
              alignItems="center"
              borderRadius="md"
            >
              <Avatar bg="teal.500" />
              <Heading color="teal.400">Create Account</Heading>

              {/* email*/}
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<MdOutlineEmail color="gray.300" />}
                  />
                  <Input type="email" placeholder="email" />
                </InputGroup>
              </FormControl>

              {/* username*/}
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaUserAlt color="gray.300" />}
                  />
                  <Input type="username" placeholder="username" />
                </InputGroup>
              </FormControl>

              {/* password */}
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
              {/* Login Button */}

              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Signup
              </Button>

              {/* Back Button */}
              <Stack alignItems="center">
                <Box>
                  Already have account?{" "}
                  <Link color="teal.500" onClick={() => navigate("/Login")}>
                    Back to Login
                  </Link>
                </Box>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Signup;
