import React, { useState, useEffect } from "react";
import { Box, Text, Button, Spinner } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import UserNavBar from "./UserProfileNavBar"; // Import the NavBar component
import api from "../../services/api-client";
import UserGameShelf from "./UserGameShelf";

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
  username: string;
  asin: string;
  shelf: string;
  rating: number;
  review: string;
}

const UserProfilePage: React.FC = () => {
  const { username } = useUser(); // Access the username from UserContext
  const [usergames, setUserGames] = useState<UserGame[]>([]);
  const [filteredUserGames, setFilteredUserGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const [expandedRow, setExpandedRow] = useState<string | null>(null); // Track the expanded row

  useEffect(() => {
    const fetchUserGames = async () => {
      setLoading(true); // Set loading to true before starting the API calls

      try {
        const response = await api.get<UserGame[]>("/v1/user_game", {
          params: { username: username },
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

  const handleRowClick = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id)); // Toggle expanded row
  };

  return (
    <Box padding="20px">
      {/* User Profile NavBar */}
      <UserNavBar />
    <Box py={6} />
      {/* Games Grid */}
      <Box px="50px">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          marginBottom="10px"
          textAlign="center"
        >
          Your Game Shelf
        </Text>
        <Box width="100%" overflowX="auto">
          <UserGameShelf
        filteredUserGames={filteredUserGames}
        userGamesData={usergames}
        loading={loading}
        expandedRow={expandedRow}
        handleRowClick={handleRowClick}
          />
        </Box>

        {/* Back to Home Button */}
        <Button as={Link} to="/" colorScheme="teal" size="md" marginTop="20px">
          Go back to Home
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
