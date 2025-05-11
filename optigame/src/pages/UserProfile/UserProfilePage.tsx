import React, { useState, useEffect } from "react";
import { Box, Text, Button, Spinner } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import UserNavBar from "./UserProfileNavBar"; // Import the NavBar component
import api from "../../services/api-client";

export interface Game {
  id: string;
  title: string;
  description: string;
  price: string;
  rating: string;
  sales_volume: string;
  reviews_count: string;
  asin: string;
  image_link: string;
}

interface UserGame {
  id: string;
  user_id: string;
  asin: string;
}

const UserProfilePage: React.FC = () => {
  const { username } = useUser(); // Access the username from UserContext
  const params = useParams<{ userId: string }>();

  const [usergames, setUserGames] = useState<UserGame[]>([]);
  const [filteredUserGames, setFilteredUserGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const fetchUserGames = async () => {
      setLoading(true); // Set loading to true before starting the API calls

      try {
        const response = await api.get<UserGame[]>("/v1/user_game", {
          params: { user_id: username },
        });

        const userGamesData = response.data;
        setUserGames(userGamesData);

        const responseGames = await api.get<Game[]>("/v1/games");
        const gamesData = responseGames.data;

        const gamesUserData = gamesData.filter((game) =>
          userGamesData.some((userGame) => userGame.asin === game.asin)
        );

        setFilteredUserGames(gamesUserData);
        console.log("Fetched games data:", gamesUserData);
      } catch (error) {
        console.error("Error fetching user games or game details:", error);
      } finally {
        setLoading(false); // Set loading to false after the API calls are complete
      }
    };

    fetchUserGames();
  }, [username]); // Ensure the dependency array is correct

  return (
    <Box padding="20px">
      {/* User Profile NavBar */}
      <UserNavBar />

      {/* Games Grid */}
      <Text fontSize="xl" fontWeight="bold" marginBottom="10px">
        Your Games
      </Text>
      <Box width="100%" overflowX="auto">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid gray",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Asin
              </th>
              <th
                style={{
                  border: "1px solid gray",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Title
              </th>
              <th
                style={{
                  border: "1px solid gray",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", padding: "20px" }}>
                  <Spinner size="lg" />
                </td>
              </tr>
            ) : filteredUserGames.length > 0 ? (
              filteredUserGames.map((game, index) => (
                <tr key={game.id || `game-${index}`}>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>
                    {game.asin}
                  </td>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>
                    {game.title}
                  </td>
                  <td style={{ border: "1px solid gray", padding: "8px" }}>
                    {game.description}
                  </td>
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