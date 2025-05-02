import {
  Button,
  Menu,
  Portal,
} from "@chakra-ui/react";

export const UserMenu = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="outline" size="sm">
          Account
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="My-Games">My Games</Menu.Item>
            <Menu.Item value="Find-Games">Find Games</Menu.Item>
            <Menu.Item value="Settings">Settings</Menu.Item>
            <Menu.Item value="Logout">Logout</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

