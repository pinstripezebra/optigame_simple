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
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
  const {
    isOpen: isReviewOpen,
    onOpen: onReviewOpen,
    onClose: onReviewClose,
  } = useDisclosure();

  // Review modal state
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [ratingError, setRatingError] = useState(false);

  const handleShelfChange = async (
    shelf: "Want_To_Play" | "Have_Played",
    selected: boolean
  ) => {
    if (shelf === "Have_Played" && selected) {
      onClose();
      onReviewOpen();
      return;
    }
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
    onClose();
  };

  const handleReviewSubmit = async () => {
    if (!rating) {
      setRatingError(true);
      return;
    }
    await apiClient.post("/v1/user_game/", {
      username,
      asin,
      shelf: "Have_Played",
      review,
      rating,
    });
    addAsin(asin);
    setHavePlayed(true);
    setWantToPlay(false);
    setReview("");
    setRating(null);
    setRatingError(false);
    onReviewClose();
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
      {/* Main Shelf Modal */}
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
                onClick={async () => {
                  await handleShelfChange("Want_To_Play", !wantToPlay);
                }}
                width="100%"
              >
                Want to play
              </Button>
              <Button
                colorScheme={havePlayed ? "green" : "gray"}
                variant={havePlayed ? "solid" : "outline"}
                onClick={async () => {
                  await handleShelfChange("Have_Played", !havePlayed);
                }}
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
      {/* Review Modal */}
      <Modal isOpen={isReviewOpen} onClose={onReviewClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Text fontWeight="bold">Leave a review and rating</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4} mt={2} mb={2} align="center" width="100%">
              <FormControl>
                <FormLabel>Review (optional)</FormLabel>
                <Input
                  placeholder="Write your review..."
                  value={review}
                  onChange={e => setReview(e.target.value)}
                />
              </FormControl>
              <FormControl isInvalid={ratingError} isRequired>
                <FormLabel>Rating (1-5 stars)</FormLabel>
                <Stack direction="row" spacing={1}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Button
                      key={star}
                      colorScheme={rating && rating >= star ? "yellow" : "gray"}
                      variant={rating && rating >= star ? "solid" : "outline"}
                      onClick={() => {
                        setRating(star);
                        setRatingError(false);
                      }}
                      size="sm"
                    >
                      ★
                    </Button>
                  ))}
                </Stack>
                {ratingError && (
                  <FormErrorMessage>Rating is required.</FormErrorMessage>
                )}
              </FormControl>
              <Button
                colorScheme="green"
                width="100%"
                onClick={handleReviewSubmit}
              >
                Submit
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GameStatus;