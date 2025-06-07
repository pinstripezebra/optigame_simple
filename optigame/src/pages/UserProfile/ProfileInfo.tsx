import React from "react";
import { useUser } from "../../context/UserContext";
import { Image, Text } from "@chakra-ui/react";

// Defining inputs
interface Game {
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

interface UserGameShelfProps {
  filteredUserGames: Game[];
  userGamesData: UserGame[]; // <-- add this prop
  loading: boolean;
  expandedRow: string | null;
  handleRowClick: (id: string) => void;
}

const ProfileInfo: React.FC<UserGameShelfProps> = ({
  filteredUserGames,
  userGamesData,
  loading,
  expandedRow,
  handleRowClick,
}) => {
  const average_rating =
    filteredUserGames.length > 0
      ? filteredUserGames.reduce(
          (sum, game) => sum + (parseFloat(game.rating) || 0),
          0
        ) / filteredUserGames.length
      : 0;
  const review_count = filteredUserGames.reduce(
    (sum, game) =>
      sum + (game.reviews_count ? parseInt(game.reviews_count) : 0),
    0
  );
  const { username } = useUser();
return (
    <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "24px" }}>
            <Image
                src="src\assets\user_profile.png"
                boxSize="200px"
                borderRadius="full"
                fit="cover"
                alt="user profile picture"
            />
        </div>
        <div>
            <Text fontSize="xl" fontWeight="bold">ProfileInfo</Text>
            <Text fontSize="md">Username: {username}</Text>
            <Text fontSize="md">Review Count: {review_count}</Text>
            <Text fontSize="md">Average Rating: {average_rating.toFixed(2)}</Text>
            <Text fontSize="md">Games in Shelf: {filteredUserGames.length}</Text>
        </div>
    </div>
);
};

export default ProfileInfo;
