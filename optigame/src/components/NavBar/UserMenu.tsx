import {
  Button,
  Menu,
  Portal,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

export const UserMenu = () => {
  return (
    <Menu>
      <MenuButton as={Button} variant="outline" size="sm">
        Account
      </MenuButton>
      <Portal>
        <MenuList>
          <MenuItem value="My-Games">My Games</MenuItem>
          <MenuItem value="Find-Games">Find Games</MenuItem>
          <MenuItem value="Settings">Settings</MenuItem>
          <MenuItem value="Logout">Logout</MenuItem>
          <MenuItem  value="Logout">Logout</MenuItem >
        </MenuList>
      </Portal>
    </Menu>
  );
};

