import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, GridItem, Button, HStack } from "@chakra-ui/react";
import NavBar from "../../components/NavBar";

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
const GamePage = () => {
  const location = useLocation();
  const game = location.state?.game as Game | undefined;

  // Optionally, redirect if no game is provided
  const navigate = useNavigate();
  if (!game) {
    navigate("/"); // or show a fallback UI
    return null;
  }

  return (
    <Grid
    templateAreas={{
      base: `"nav" "main"`,
      lg: `"nav nav" "main main"`, // main takes full width on large screens
    }}
    templateColumns={{
      base: "1fr",
      lg: "1fr 3fr",
    }}
  >
      {/* Navigation Bar */}
      <GridItem area="nav" position="sticky" top="0" zIndex={1000}>
        <NavBar onSearch={() => {}} />
      </GridItem>

      {/* Main Content */}
      <GridItem area="main" padding="10px">
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 2fr" }}
          gap={8}
          alignItems="flex-start"
        >
          {/* Left: Game Image */}
          <GridItem>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                background: "#f5f5f5",
                borderRadius: "8px",
                overflow: "hidden",
                paddingLeft: 0, // Remove left padding
                boxSizing: "border-box",
                aspectRatio: "1 / 1",
              }}
            >
              <img
                src={game.image_link}
                alt={game.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  marginLeft: 0, // Ensure no margin
                  display: "block",
                }}
              />
            </div>
          </GridItem>
          {/* Right: Game Details */}
          <GridItem>
            <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{game.title}</h1>
            <p style={{ marginBottom: "1rem" }}>{game.description}</p>
            <p>
              <strong>Rating:</strong> {game.rating}
            </p>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};



export default GamePage;