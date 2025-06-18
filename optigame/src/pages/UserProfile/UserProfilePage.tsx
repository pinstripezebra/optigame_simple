import React, { useState, useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { Link, useNavigate  } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import UserNavBar from "./UserProfileNavBar";
import api from "../../services/api-client";
import UserGameShelf from "./UserGameShelf";
import ProfileInfo from "./ProfileInfo";


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

/**
 * UserProfilePage component displays the user's profile information and their game shelves.
 *
 * This page fetches and displays the user's games, splitting them into "Want To Play" and "Have Played" shelves.
 * It also renders profile information and allows expanding/collapsing rows for detailed views.
 *
 * Data is fetched from the backend using the current user's username, and the component manages loading state and expanded row state.
 *
 * @component
 * @returns {JSX.Element} The rendered user profile page with game shelves and profile info.
 */
const UserProfilePage: React.FC = () => {
  const { username } = useUser();
  const [usergames, setUserGames] = useState<UserGame[]>([]);
  const [wantToPlayGames, setWantToPlayGames] = useState<UserGame[]>([]);
  const [havePlayedGames, setHavePlayedGames] = useState<UserGame[]>([]);
  const [wantToPlayFiltered, setWantToPlayFiltered] = useState<Game[]>([]);
  const [havePlayedFiltered, setHavePlayedFiltered] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserGames = async () => {
      setLoading(true);
      try {
        const response = await api.get<UserGame[]>(`/v1/user_game/`, { params: { username } });
        const userGamesData = response.data;
        setUserGames(userGamesData);

        // Split userGamesData by shelf
        const wantToPlay = userGamesData.filter(
          (ug) => ug.shelf === "Want_To_Play"
        );
        const havePlayed = userGamesData.filter(
          (ug) => ug.shelf === "Have_Played"
        );
        setWantToPlayGames(wantToPlay);
        setHavePlayedGames(havePlayed);

        // Fetch all games and filter for user's games
        const responseGames = await api.get<Game[]>("/v1/games");
        const gamesData = responseGames.data;

        // Filtered Game objects for each shelf
        setWantToPlayFiltered(
          gamesData.filter((game) =>
            wantToPlay.some((ug) => ug.asin === game.asin)
          )
        );
        setHavePlayedFiltered(
          gamesData.filter((game) =>
            havePlayed.some((ug) => ug.asin === game.asin)
          )
        );
      } catch (error) {
        console.error("Error fetching user games or game details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGames();
  }, [username]);

  const handleRowClick = (game: Game) => {
  navigate(`/asin/${game.asin}`, { state: { game } });
};
  return (
    <Box>
      <UserNavBar />
      <Box padding="20px">
        <Box px="40px">
          <ProfileInfo
            filteredUserGames={havePlayedFiltered}
            userGamesData={usergames}
            loading={loading}
            expandedRow={expandedRow}
           
          />

          <Box py={6} />

          <Text fontSize="2xl" fontWeight="bold" mb="10px" textAlign="center">
            {username ? `${username}'s Game Shelf` : "Game Shelf"}
          </Text>
          <Box width="100%" overflowX="auto">
            <Text fontSize="xl" fontWeight="semibold" mt={6} mb={2}>
              Have Played
            </Text>
            <UserGameShelf
              filteredUserGames={havePlayedFiltered}
              userGamesData={havePlayedGames}
              loading={loading}
              expandedRow={expandedRow}
              handleRowClick={handleRowClick}
            />
          </Box>
          <Text fontSize="xl" fontWeight="semibold" mb={2}>
            Want To Play
          </Text>
          <UserGameShelf
            filteredUserGames={wantToPlayFiltered}
            userGamesData={wantToPlayGames}
            loading={loading}
            expandedRow={expandedRow}
            handleRowClick={handleRowClick}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
