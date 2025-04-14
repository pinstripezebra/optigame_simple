import { HStack, Image, Text } from '@chakra-ui/react'
import logo from '../assets/logo.jpg'

const NavBar = () => {
  return (
    <HStack> 
        <Image src = {logo} boxSize='60px'/> 
        <Text>Navigation </Text>
    
    </HStack>
  )
}

export default NavBar