import { Game } from "./GameGrid";
import { Card, Image, Text, Flex, Box } from "@chakra-ui/react";
import { GameScore } from "./GameScore";
import { Checkbox } from "@chakra-ui/react";
import { useUser } from "../context/UserContext";
import apiClient from "../services/api-client";

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  let imageUrl;

  try {
    // Check if the URL is valid and prepend 'https://' if necessary
    imageUrl = game.image_link.startsWith("http")
      ? game.image_link
      : `https://${game.image_link}`;
    // Validate the URL using the URL constructor
    imageUrl = new URL(imageUrl).toString();
  } catch {
    // Fallback to a default image if the URL is invalid
    imageUrl = "https://via.placeholder.com/150";
  }

  // Ensuring the title is not too long for display
  const truncatedTitle =
    game.title.length > 100 ? `${game.title.slice(0, 100)}...` : game.title;

  // Ensuring we have user information for updating liked games if necessary
  const { username } = useUser(); //Loading username from context

  return (
    <Card
      borderRadius={10}
      overflow="hidden"
      justifyContent="center"
      alignItems="center"
      display="flex"
      padding="10px"
    >
      <Image
        src={imageUrl}
        alt={game.title}
        boxSize="300px" // Setting width and height to 200px
        fit="cover" // Ensure the image covers the box while maintaining aspect ratio
      />
      <Card
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Text fontSize="2xl">{truncatedTitle}</Text>

        <Flex
          alignItems="center"
          justifyContent="space-between"
          marginTop="10px" // Reduced margin to decrease space
        >
          {/* Group Text and GameScore together */}
          <Flex alignItems="center">
            <Text fontSize="lg" color="gray.600" marginRight="5px">
              Score
            </Text>
            <GameScore rating={game.rating} />
          </Flex>

          {/* If user checks box gamme is logged to 'liked' user_games table */}
            <Checkbox
              size="lg"
              colorScheme="teal"
              onChange={async (e) => {
              if (e.target.checked) {
                await apiClient.post("/v1/user_game/", {
                  "username": username,
                  "asin": game.asin,
                });
                console.log("Game added to collection");
                console.log(username);
                console.log(game.asin);
              }
              }}
            >
              Your Collection
            </Checkbox>
        </Flex>
      </Card>
    </Card>
  );
};
export default GameCard;
