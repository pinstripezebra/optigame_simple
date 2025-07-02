import { Card, Image, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface Props {
  game: any; 
}

const UserRecommendedCard = ({ game }: Props) => {
  const navigate = useNavigate();

  let imageUrl = "https://via.placeholder.com/150";
  if (game && game.image_link) {
    try {
      imageUrl = game.image_link.startsWith("http")
        ? game.image_link
        : `https://${game.image_link}`;
      imageUrl = new URL(imageUrl).toString();
    } catch {
      imageUrl = "https://via.placeholder.com/150";
    }
  }

  if (!game) {
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
        <Text fontWeight="bold" textAlign="center">{game.title}</Text>
      </Box>
    </Card>
  );
};

export default UserRecommendedCard;