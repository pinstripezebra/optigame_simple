import React from 'react'
import { HStack, Image, Text, Spacer, Box } from "@chakra-ui/react";
import logo from "../assets/chess_logo.jpg";


const OptigameLogo = () => {
  return (
    <div><HStack>
            <Image src={logo} boxSize="60px" borderRadius={10} />
            <Text fontSize="2xl" fontWeight="bold">
              Optigame
            </Text>
          </HStack>
    </div>
  )
}

export default OptigameLogo