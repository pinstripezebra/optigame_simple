import React from "react";
import { Box, Text, Grid, GridItem, Button } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface Game {
  id: string;
  name: string;
  tag: string;
  description: string;
}

interface UserProfilePageProps {
  games: Game[];
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ games }) => {
  const { username } = useUser(); // Access the username from UserContext
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
      <Box width="100%" overflowX="auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left" }}>Name</th>
              <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left" }}>Tag</th>
              <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {games.length > 0 ? (
              games.map((game) => (
                <tr key={game.id}>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>{game.name}</td>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>{game.tag}</td>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>{game.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    border: "1px solid gray",
                    padding: "8px",
                    textAlign: "center",
                    color: "gray",
                  }}
                >
                  No games available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>

      {/* Back to Home Button */}
      <Button as={Link} to="/" colorScheme="teal" size="md" marginTop="20px">
        Go back to Home
      </Button>
    </Box>
  );
};

export default UserProfilePage;
