import { Card, Image, Text, Spinner, Box } from "@chakra-ui/react";
import { GameSimilarity } from "./SimilarGames";
import { useNavigate } from "react-router-dom";
import useGame from '../../hooks/useGame';

interface Props {
  game: GameSimilarity; // receives id, game1, game2, similarity
}

const SimilarGameCard = ({ game }: Props) => {
  const navigate = useNavigate();

  // Fetch the full game2 object using useGame and game.game2 as the asin/id
  const { data, loading, error } = useGame(game.game2);
  const game2 = Array.isArray(data) ? data[0] : data;

  let imageUrl = "https://via.placeholder.com/150";
  if (game2 && game2.image_link) {
    try {
      imageUrl = game2.image_link.startsWith("http")
        ? game2.image_link
        : `https://${game2.image_link}`;
      imageUrl = new URL(imageUrl).toString();
    } catch {
      imageUrl = "https://via.placeholder.com/150";
    }
  }

  if (loading) {
    return (
      <Card
        borderRadius={10}
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection="column"
        padding="2px"
        minHeight="320px"
      >
        <Spinner />
      </Card>
    );
  }

  if (error || !game2) {
    return (
      <Card
        borderRadius={10}
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
        display="flex"
        flexDirection="column"
        padding="2px"
        minHeight="320px"
      >
        <Text>Error loading game</Text>
      </Card>
    );
  }

  return (
    <Card
      borderRadius={10}
      overflow="hidden"
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      padding="2px"
      onClick={() => navigate(`/asin/${game2.asin}`, { state: { game: game2 } })}
      cursor="pointer"
    >
      <Image
        src={imageUrl}
        alt={game2.title}
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
        <Text fontWeight="bold" textAlign="center">{game2.title}</Text>
        <Text fontSize="sm" textAlign="center">{game2.description}</Text>
        <Text fontSize="xs" textAlign="center" color="gray.500">
          Similarity: {game.similarity.toFixed(2)}
        </Text>
      </Box>
    </Card>
  );
};

export default SimilarGameCard;