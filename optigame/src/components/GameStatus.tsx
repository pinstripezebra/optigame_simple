import {
  Button,
  Text,
  useDisclosure,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import { useUserGames } from "../context/UserGamesContext";
import apiClient from "../services/api-client";
import { useState } from "react";

import { FaTrash } from "react-icons/fa";

interface GameStatusProps {
  asin: string;
}

const GameStatus = ({ asin }: GameStatusProps) => {
  const { username } = useUser();
  const { asins, addAsin, removeAsin } = useUserGames();

  const [wantToPlay, setWantToPlay] = useState(false);
  const [havePlayed, setHavePlayed] = useState(false);

  const isActive = asins.includes(asin);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleShelfChange = async (
    shelf: "Want_To_Play" | "Have_Played",
    selected: boolean
  ) => {
    if (selected) {
      await apiClient.post("/v1/user_game/", {
        username,
        asin,
        shelf,
      });
      addAsin(asin);
      if (shelf === "Want_To_Play") setWantToPlay(true);
      if (shelf === "Have_Played") setHavePlayed(true);
    } else {
      await apiClient.delete("/v1/user_game/", {
        params: { username, asin },
      });
      removeAsin(asin);
      if (shelf === "Want_To_Play") setWantToPlay(false);
      if (shelf === "Have_Played") setHavePlayed(false);
    }
  };

  return (
    <>
      <Button
        colorScheme={isActive ? "green" : "gray"}
        variant={isActive ? "solid" : "outline"}
        onClick={onOpen}
        size="sm"
      >
        {isActive ? "On Your Shelf" : "Add To Shelf"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Text fontWeight="bold">Choose a shelf for this game</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={2} mt={2} mb={2} align="center" width="100%">
              <Button
                colorScheme={wantToPlay ? "green" : "gray"}
                variant={wantToPlay ? "solid" : "outline"}
                onClick={() => handleShelfChange("Want_To_Play", !wantToPlay)}
                width="100%"
              >
                Want to play
              </Button>
              <Button
                colorScheme={havePlayed ? "green" : "gray"}
                variant={havePlayed ? "solid" : "outline"}
                onClick={() => handleShelfChange("Have_Played", !havePlayed)}
                width="100%"
              >
                Have played
              </Button>
              <Button
                leftIcon={<FaTrash />}
                colorScheme="red"
                variant="outline"
                width="100%"
                mt={4}
                onClick={async () => {
                  // Remove both shelf statuses and from collection
                  await apiClient.delete("/v1/user_game/", {
                    params: { username, asin },
                  });
                  removeAsin(asin);
                  setWantToPlay(false);
                  setHavePlayed(false);
                  onClose();
                }}
              >
                Remove from shelf
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GameStatus;
