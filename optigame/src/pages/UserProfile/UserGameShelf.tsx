import React from 'react'
import { Spinner, Image } from "@chakra-ui/react";

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

const UserGameShelf: React.FC<UserGameShelfProps> = ({
  filteredUserGames,
  userGamesData,
  loading,
  expandedRow,
  handleRowClick,
}) => (
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr>
        <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left", width: "20%" }}>Image</th>
        <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left", width: "20%" }}>Title</th>
        <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left", width: "10%" }}>Your Rating</th>
        <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left", width: "10%" }}> Your Review</th>
      </tr>
    </thead>
    <tbody>
      {loading ? (
        <tr>
          <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
            <Spinner size="lg" />
          </td>
        </tr>
      ) : filteredUserGames.length > 0 ? (
        filteredUserGames.map((game) => {
          // Find the review for this game by asin
          const userGame = userGamesData.find((ug) => ug.asin === game.asin);
          return (
            <tr
              key={game.id}
              onClick={() => handleRowClick(game.id)}
              style={{
                cursor: "pointer",
                backgroundColor: expandedRow === game.id ? "#f9f9f9" : "transparent",
              }}
            >
              <td style={{ border: "1px solid gray", padding: "8px", width: "20%" }}>
                <Image
                  src={game.image_link}
                  alt={game.title}
                  boxSize="60px"
                  objectFit="cover"
                  borderRadius="6px"
                  fallbackSrc="https://via.placeholder.com/48"
                />
              </td>
              <td style={{ border: "1px solid gray", padding: "8px", width: "20%" }}>{game.title}</td>
              <td style={{ border: "1px solid gray", padding: "8px", width: "10%" }}>{userGame?.rating}</td>
              <td style={{ border: "1px solid gray", padding: "8px", width: "10%" }}>
                {userGame?.review ?? "—"}
              </td>
            </tr>
          );
        })
      ) : (
        <tr>
          <td colSpan={5} style={{ border: "1px solid gray", padding: "8px", textAlign: "center", color: "gray" }}>
            No games available.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default UserGameShelf;