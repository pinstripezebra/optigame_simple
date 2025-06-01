import { Game } from "./GameGrid";
import { Card, Image, Text, Flex, Box } from "@chakra-ui/react";
import { GameScore } from "./GameScore";
import { Checkbox } from "@chakra-ui/react";
import apiClient from "../services/api-client";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useUserGames } from "../context/UserGamesContext";
import GameStatus from "./GameStatus";

interface Props {
  game: Game;
}

const GameCard = ({ game }: Props) => {
  let imageUrl;
  const navigate = useNavigate();
  try {
    imageUrl = game.image_link.startsWith("http")
      ? game.image_link
      : `https://${game.image_link}`;
    imageUrl = new URL(imageUrl).toString();
  } catch {
    imageUrl = "https://via.placeholder.com/150";
  }

  const truncatedTitle =
    game.title.length > 100 ? `${game.title.slice(0, 100)}...` : game.title;

  const { username } = useUser();
  const { asins, addAsin, removeAsin } = useUserGames();
  console.log("asins in GameCard:", asins);
  const isChecked = asins.includes(game.asin);

  return (
    <Card
      borderRadius={10}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      padding="10px"
      width="320px"
    >
      {/* Clickable area: image and title */}
      <Box
        onClick={() => navigate(`/asin/${game.asin}`, { state: { game } })}
        cursor="pointer"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Image src={imageUrl} alt={game.title} boxSize="300px" fit="cover" />
        <Text fontSize="2xl" mt={2}>
          {truncatedTitle}
        </Text>
      </Box>

      {/* Info area: not clickable */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        marginTop="10px"
        px={2}
      >
        <Flex alignItems="center">
          <Text fontSize="lg" color="gray.600" marginRight="5px">
            Score
          </Text>
          <GameScore rating={game.rating} />
        </Flex>
        <GameStatus asin={game.asin} />
      </Flex>
    </Card>
  );
};

export default GameCard;
