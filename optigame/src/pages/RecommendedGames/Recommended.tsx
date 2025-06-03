import { useState, useEffect } from "react";
import { Grid, GridItem, Button, HStack } from "@chakra-ui/react";
import NavBar from "../../components/NavBar";
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


function RecommendedPage() {
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

  // Filter by search
  const handleSearch = (title: string) => {
    const filtered = games.filter((game) =>
      title ? game.title.toLowerCase().includes(title.toLowerCase()) : true
    );
    setFilteredGames(filtered);
    setCurrentPage(1); // Reset to first page on search
  };



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

    </Grid>
  );
}

export default RecommendedPage;
