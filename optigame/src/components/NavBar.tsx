import {
  HStack,
  Image,
  Text,
  Button,
  Spacer,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { useRef } from "react";
import logo from "../assets/chess_logo.jpg";
import { ColorModeSwitch } from "./NavBar/ColorModeButton";
import { UserMenu } from "./NavBar/UserMenu";

const NavBar = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <HStack padding="10px">
      <Image src={logo} boxSize="60px" borderRadius={10} />
      <Text fontSize="2xl" fontWeight="bold">
        Optigame
      </Text>
      <Spacer />
      <ColorModeSwitch />
      <UserMenu />
    </HStack>
  );
};

export default NavBar;
