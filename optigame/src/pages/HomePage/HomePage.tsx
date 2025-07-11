import { useState, useEffect } from "react";
import { Grid, GridItem, Button, HStack } from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
import GameGrid from "./GameGrid";
import GenreList from "./GenreList";
import api from "../../services/api-client";

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
  const [selectedGameTags, setSelectedGameTags] = useState<string | null>(null);
  const [sortType, setSortType] = useState<string>("");

  const handleSortSelect = (type: string) => {
    setSortType(type);
  };
  useEffect(() => {
    const fetchGames = async () => {
      const response = await api.get<Game[]>("/v1/games/");
      setGames(response.data);
      setFilteredGames(response.data);
    };

    fetchGames();
  }, []);

  // Filter by search
  const handleSearch = (title: string) => {
    const filtered = games.filter((game) =>
      title ? game.title.toLowerCase().includes(title.toLowerCase()) : true
    );
    setFilteredGames(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter by genre
  useEffect(() => {
    const filterByGenre = async () => {
      if (selectedGameTags) {
        // Fetch asins for the selected genre
        const response = await api.get<{ asin: string }[]>(
          "/v1/genres_filtered/",
          {
            params: { genre: selectedGameTags },
          }
        );
        const asinList = response.data.map((item) => item.asin);
        console.log("Asin List:", asinList);
        // Filter games by asin
        const filtered = games.filter((game) => asinList.includes(game.asin));
        setFilteredGames(filtered);
        setCurrentPage(1);
      } else {
        // If no genre selected, show all games
        setFilteredGames(games);
      }
    };
    filterByGenre();
  }, [selectedGameTags, games]);
  let sortedGames = [...filteredGames];
if (sortType === "most_popular") {
  sortedGames.sort((a, b) => {
    // Convert sales_volume to number if needed, fallback to 0 if not a number
    const salesA = Number(a.sales_volume) || 0;
    const salesB = Number(b.sales_volume) || 0;
    return salesB - salesA;
  });
}
else if (sortType === "trending") {
  sortedGames.sort((a, b) => b.rating - a.rating);
} else if (sortType === "recommended") {
  sortedGames.sort((a, b) => b.reviews_count - a.reviews_count);
}

  // Pagination logic
  const totalPages = Math.ceil(sortedGames.length / GAMES_PER_PAGE);
  const startIdx = (currentPage - 1) * GAMES_PER_PAGE;
  const endIdx = startIdx + GAMES_PER_PAGE;
  const gamesToShow = sortedGames.slice(startIdx, endIdx);

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "1fr 3fr",
      }}
    >
      {/* Navigation Bar */}
      <GridItem area="nav" position="sticky" top="0" zIndex={1000}>
        <NavBar onSearch={handleSearch} />
      </GridItem>

      {/* Genre List */}
      <GridItem area="aside" padding="10px" bg="gray.100">
        <GenreList onGenreSelect={setSelectedGameTags} onSortSelect={handleSortSelect} />
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
