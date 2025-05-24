import React from 'react'
import { Spinner } from "@chakra-ui/react";

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

interface UserGameShelfProps {
  filteredUserGames: Game[];
  loading: boolean;
  expandedRow: string | null;
  handleRowClick: (id: string) => void;
}

const UserGameShelf: React.FC<UserGameShelfProps> = ({
  filteredUserGames,
  loading,
  expandedRow,
  handleRowClick,
}) => (
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr>
        <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left", width: "20%" }}>Asin</th>
        <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left", width: "30%" }}>Title</th>
        <th style={{ border: "1px solid gray", padding: "8px", textAlign: "left", width: "50%" }}>Description</th>
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
        filteredUserGames.map((game) => (
          <tr
            key={game.id}
            onClick={() => handleRowClick(game.id)}
            style={{
              cursor: "pointer",
              backgroundColor: expandedRow === game.id ? "#f9f9f9" : "transparent",
            }}
          >
            <td style={{ border: "1px solid gray", padding: "8px", width: "20%" }}>{game.asin}</td>
            <td style={{ border: "1px solid gray", padding: "8px", width: "30%" }}>{game.title}</td>
            <td style={{ border: "1px solid gray", padding: "8px", width: "50%" }}>
              {expandedRow === game.id
                ? game.description
                : `${game.description.slice(0, 50)}...`}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3} style={{ border: "1px solid gray", padding: "8px", textAlign: "center", color: "gray" }}>
            No games available.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default UserGameShelf;