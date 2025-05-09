import React from "react";
import { Box, Text, Grid, GridItem, Button } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import  UserNavBar from "./UserProfileNavBar"; // Import the NavBar component
import { useState, useEffect } from "react";
import api from "../../services/api-client";

interface Game {
  id: string;
  name: string;
  tag: string;
  description: string;
}

interface  UserGame {
  id: string;
  user_id: string;
  asin: string;
}

interface UserProfilePageProps {
  games: Game[];
  usergames: UserGame[];
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ games}) => {
  const { username } = useUser(); // Access the username from UserContext
  const params = useParams<{ userId: string }>();


  const [usergames, setUserGames] = useState<UserGame[]>([]);
  const [filteredGames, setFilteredUserGames] = useState<UserGame[]>([]);
  
  useEffect(() => {
      const fetchUserGames = async () => {
        const response = await api.get<Game[]>("/v1/games/");
        const userGamesData = response.data.map((game) => ({
          id: game.id,
          user_id: "", // Replace with actual user_id if available
          asin: "", // Replace with actual asin if available
        }));
        setUserGames(userGamesData);
        setFilteredUserGames(userGamesData);
      };
  
      fetchUserGames();
    }, []);

  return (
    <Box padding="20px">
      {/* User Profile NavBar */}
      <UserNavBar/> {/* Pass an empty function for onSearch */}

      {/* Games Grid */}
      <Text fontSize="xl" fontWeight="bold" marginBottom="10px">
        Your Games
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


