import { Card, Image, Text, Flex, Box } from "@chakra-ui/react";
import { GameSimilarity } from "./SimilarGames";
import { useNavigate } from "react-router-dom";



interface Props {
  game: GameSimilarity;
}

const SimilarGameCard = ({ game }: Props) => {
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

  return (
    <Card
      borderRadius={10}
      overflow="hidden"
      justifyContent="center"
      alignItems="center"
      display="flex"
      flexDirection="column"
      padding="2px"
      onClick={() => navigate(`/asin/${game.asin}`, { state: { game } })}
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

        <Flex
          alignItems="center"
          justifyContent="space-between"
          marginTop="10px"
        >

        </Flex>
      </Box>
    </Card>
  )
};

export default SimilarGameCard;