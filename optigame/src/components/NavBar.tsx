import { HStack, Image, Text,Spacer, Box, Button, Menu, Portal } from "@chakra-ui/react";
import { useRef } from "react"
import { ChevronDownIcon } from "@chakra-ui/icons";
import logo from "../assets/logo.jpg";

const NavBar = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const getAnchorRect = () => ref.current!.getBoundingClientRect()
  return (
    <HStack padding="10px">
      <Image src={logo} boxSize="60px" />
      <Text fontSize="2xl" fontWeight="bold">
        Optigame
      </Text>
      <Spacer />
      <Menu.Root positioning={{ getAnchorRect }}>
      <Menu.Trigger asChild>
        <Button variant="outline" size="sm">
          Open
        </Button>
      </Menu.Trigger>
      <Box layerStyle="fill.subtle" p="4" ref={ref} mt="4">
        Anchor
      </Box>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt">New Text File</Menu.Item>
            <Menu.Item value="new-file">New File...</Menu.Item>
            <Menu.Item value="new-win">New Window</Menu.Item>
            <Menu.Item value="open-file">Open File...</Menu.Item>
            <Menu.Item value="export">Export</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
    </HStack>
  );
};

export default NavBar;