import {
  Button,
  Menu,
  Portal,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
export const UserMenu = () => {
  const navigate = useNavigate();
  return (
    <Menu>
      <MenuButton as={Button} variant="outline" size="sm">
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
  );
};
