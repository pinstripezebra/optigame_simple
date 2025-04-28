import { HStack, Image, Text, Spacer } from '@chakra-ui/react';
import { Menu, MenuList, MenuButton, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import logo from '../assets/logo.jpg';

const NavBar = () => {
  return (
    <HStack padding="10px">
      {/* Logo and Title */}
      <Image src={logo} boxSize="60px" />
      <Text fontSize="2xl" fontWeight="bold">
        Optigame
      </Text>

      {/* Spacer to push the dropdown to the far right */}
      <Spacer />

      {/* User Dropdown */}
      <Menu>
        <MenuButton as={Button}>
          User <ChevronDownIcon />
        </MenuButton>
        <MenuList>
          <MenuItem value="profile">Profile</MenuItem>
          <MenuItem value="settings">Settings</MenuItem>
          <MenuItem value="logout">Logout</MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

export default NavBar;