import { useState, useEffect } from "react";
import { Grid, GridItem, Button, HStack  } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import GameGrid from "../components/GameGrid";
import GenreList from "../components/GenreList";
import api from "../services/api-client";

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

const GAMES_PER_PAGE = 20;

function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);
  const startIdx = (currentPage - 1) * GAMES_PER_PAGE;
  const endIdx = startIdx + GAMES_PER_PAGE;
  const gamesToShow = filteredGames.slice(startIdx, endIdx);

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
        <GameGrid games={gamesToShow} />
        {/* Pagination Controls */}
        <HStack justify="center" mt={4}>
          <Button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      </GridItem>
    </Grid>
  );
}

export default HomePage;