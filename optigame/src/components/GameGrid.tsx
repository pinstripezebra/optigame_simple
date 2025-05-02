import { useState, useEffect } from "react";
import api from "../services/api-client";
import { SimpleGrid } from "@chakra-ui/react";
import GameCard from "./GameCard";
import SearchGames from "./NavBar/Search";

export interface Game {
  id: string;
  description: string;
  asin: string;
  title: string;
  price: number;
  rating: number;
  sales_volume: string;
  reviews_count: number;
  image_link: string;
}

const GameGrid = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const fetchGames = async () => {
    const response = await api.get<Game[]>("/v1/games/");
    setGames(response.data);
    setFilteredGames(response.data);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSearch = (title: string) => {
    // Filter games based on the title field
    const filtered = games.filter((game) =>
      title ? game.title.toLowerCase().includes(title.toLowerCase()) : true
    );
    setFilteredGames(filtered);
  };

  return (
    <div>
      <div className="container">
        <SearchGames onSearch={handleSearch} /> {/* Use the SearchGames component */}

        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={10}>
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
};

export default GameGrid;