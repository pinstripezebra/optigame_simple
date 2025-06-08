import {
  Button,
  Menu,
  Portal,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
export const UserMenu = () => {
  const navigate = useNavigate();
  return (
    <Box bg="white" color="black">
      <Menu>
      <MenuButton as={Button} variant="outline" size="sm" borderRadius = 'md'>
        Account
      </MenuButton>
      <Portal>
        <MenuList>
        <MenuItem onClick={() => navigate("/user")} value="My-Account">
          My Account
        </MenuItem>
        <MenuItem value="Find-Games">Find Games</MenuItem>
        <MenuItem value="Settings">Settings</MenuItem>
        <MenuItem onClick={() => navigate("/Logout")} value="Logout">
          Logout
        </MenuItem>
        </MenuList>
      </Portal>
      </Menu>
    </Box>
  );
};
