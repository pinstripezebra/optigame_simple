import { HStack, Image, Text, Spacer, Menu, MenuList, MenuButton, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.jpg";

const NavBar = () => {
  return (
    <HStack padding="10px">
      <Image src={logo} boxSize="60px" />
      <Text fontSize="2xl" fontWeight="bold">
        Optigame
      </Text>
      <Spacer />
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