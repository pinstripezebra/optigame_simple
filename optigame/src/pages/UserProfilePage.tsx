import React from "react";
import { Box, Text, Grid, GridItem, Button } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";

interface Game {
  id: string;
  name: string;
  tag: string;
  description: string;
}

interface UserProfilePageProps {
  username: string;
  games: Game[];
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  username,
  games,
}) => {
  const params = useParams<{ userId: string }>();
  return (
    <Box padding="20px">
      <div>
        <Text fontSize="xl" marginBottom="4">
          {`User ID: ${params.userId}`}
        </Text>
      </div>
      {/* User Info */}
      <Box marginBottom="20px">
        <Text fontSize="2xl" fontWeight="bold">
          {`Username: ${username}`}
        </Text>
      </Box>

      {/* Games Grid */}
      <Text fontSize="xl" fontWeight="bold" marginBottom="10px">
        Games
      </Text>
      <Grid
        templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
        gap={6}
      >
        {games.map((game) => (
          <GridItem
            key={game.id}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            padding="10px"
          >
            <Text fontSize="lg" fontWeight="bold">
              {game.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {game.tag}
            </Text>
            <Text fontSize="md" marginTop="5px">
              {game.description}
            </Text>
          </GridItem>
        ))}
      </Grid>

      {/* Back to Home Button */}
      <Button as={Link} to="/" colorScheme="teal" size="md" marginTop="20px">
        Go back to Home
      </Button>
    </Box>
  );
};

export default UserProfilePage;
