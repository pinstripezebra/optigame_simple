import { useColorMode, ColorModeButton } from "./ui/color-mode"


export const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode(); // Access color mode and toggle function

  return (

      <ColorModeButton />
  )
};

