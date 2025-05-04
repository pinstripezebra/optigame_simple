import { useState } from "react";
import "./LoginSignup.css";
import {
  Box,
  Flex,
  Avatar,
  Heading,
  Stack,
  Button,
  Text
} from "@chakra-ui/react";

const Logout = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
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
        <Heading color="teal.400">Goodbye</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
                <Text fontSize="lg" color="teal.400">
                  You have successfully logged out. Thank you for using our service!
                </Text>

              {/* Return to Login Button */}

              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Back to Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>

      
    </Flex>
  );
};

export default Logout;
