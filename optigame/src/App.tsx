import { useState, useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import api from "./services/api-client";

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

function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const response = await api.get<Game[]>("/v1/games/");
      setGames(response.data);
      setFilteredGames(response.data);
    };

    fetchGames();
  }, []);

  const handleSearch = (title: string) => {
    const filtered = games.filter((game) =>
      title ? game.title.toLowerCase().includes(title.toLowerCase()) : true
    );
    setFilteredGames(filtered);
  };

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`, // Two-column layout with GenreList on the left
      }}
      templateColumns={{
        base: "1fr", // Single column for small screens
        lg: "1fr 3fr", // 1:3 ratio with GenreList on the left
      }}
    >
      {/* Navigation Bar */}
      <GridItem area="nav">
        <NavBar onSearch={handleSearch} />
      </GridItem>
  
      {/* Genre List */}
      <GridItem area="aside" padding="10px" bg="gray.100">
        <GenreList />
      </GridItem>
  
      {/* Main Content (GameGrid) */}
      <GridItem area="main" padding="10px">
        <GameGrid games={filteredGames} />
      </GridItem>
    </Grid>
  );
}

export default App;