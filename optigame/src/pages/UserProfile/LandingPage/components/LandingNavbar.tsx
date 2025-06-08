import React from "react";
import { Box, HStack, Button, Text } from "@chakra-ui/react";

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const LandingNavbar = () => {
  return (
    <Box
      as="nav"
      width="100%"
      bg="teal.500"
      px={6}
      py={3}
      boxShadow="md"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <HStack spacing={8} justify="center">
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "teal.600" }}
          onClick={() => scrollToSection("introduction")}
        >
          Introduction
        </Button>
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "teal.600" }}
          onClick={() => scrollToSection("features")}
        >
          Features
        </Button>
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "teal.600" }}
          onClick={() => scrollToSection("aboutus")}
        >
          About Us
        </Button>
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "teal.600" }}
          onClick={() => scrollToSection("contactus")}
        >
          Contact Us
        </Button>
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: "teal.600" }}
          onClick={() => scrollToSection("gallery")}
        >
          Gallery
        </Button>
      </HStack>
    </Box>
  );
};

export default LandingNavbar;
