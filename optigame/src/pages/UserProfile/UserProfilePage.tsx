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
  const [filteredGames, setFilteredUserGames] = useState<Game[]>([]);
  
  useEffect(() => {
    const fetchUserGames = async () => {
      try {
        const response = await api.get<UserGame[]>("/v1/user_game/", {
          params: { user_id: username }, // Pass username as user_id
        });
        const userGamesData = response.data.map((game) => ({
          id: game.id,
          user_id: game.user_id, // Use actual user_id from response
          asin: game.asin, // Use actual asin from response
        }));
        setUserGames(userGamesData);
        console.log(userGamesData);

        // Fetch Game objects for each asin
        const gamePromises = userGamesData.map(async (userGame) => {
          const gameResponse = await api.get<Game>(`/v1/games/`, {
            params: { asin: userGame.asin },
          });
          return gameResponse.data;
        });

        const gamesData = await Promise.all(gamePromises);
        setFilteredUserGames(gamesData as Game[]);
        console.log(gamesData);
      } catch (error) {
        console.error("Error fetching user games or game details:", error);
      }
    };

    fetchUserGames();
  }, [username]);


    

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


