import { Game } from "./GameGrid";
import { Card, Image, Text, Flex, Box } from "@chakra-ui/react";
import { GameScore } from "./GameScore";
import { Checkbox } from "@chakra-ui/react";
import apiClient from "../services/api-client";
import { useNavigate } from "react-router-dom";

// user context
import { useUser } from "../context/UserContext";
import { useUserGames } from "../context/UserGamesContext";


interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  let imageUrl;
  const navigate = useNavigate();
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

  // Ensuring we have username and games context
  const { username } = useUser(); 
  const { asins } = useUserGames();

  // Check if the game is already in the user's collection
  const isChecked = asins.includes(game.asin);

  return (
    <Card
      borderRadius={10}
      overflow="hidden"
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      padding="10px"
      onClick={() => navigate(`/asin/${game.asin}`)}
      cursor="pointer"
    >
      <Image
        src={imageUrl}
        alt={game.title}
        boxSize="300px"
        fit="cover"
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        width="100%"
        marginTop="10px"
      >
        <Text fontSize="2xl">{truncatedTitle}</Text>

        <Flex
          alignItems="center"
          justifyContent="space-between"
          marginTop="10px"
        >
          <Flex alignItems="center">
            <Text fontSize="lg" color="gray.600" marginRight="5px">
              Score
            </Text>
            <GameScore rating={game.rating} />
          </Flex>

          <Checkbox
            size="lg"
            colorScheme="teal"
            isChecked={isChecked}
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
      </Box>
    </Card>
  )
};

export default GameCard;
