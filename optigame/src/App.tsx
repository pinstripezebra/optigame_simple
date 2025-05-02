import { Grid, GridItem} from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";
import GenreList from "./components/GenreList";
import { ColorModeProvider } from "./components/ui/color-mode"
import { Theme } from "@chakra-ui/react"


function App() {
  return (
      <Grid
        templateAreas={{
          base: `"nav" "main"`,
          lg: `"nav nav" "aside main"`,
        }}
      >
        <GridItem area="nav">
          <NavBar />
        </GridItem>
        <GridItem area="aside" paddingX={2}>
          <GenreList />
        </GridItem>
        <GridItem area="main" bg="dodgerblue">
          <GameGrid />
        </GridItem>
      </Grid>
  );
}

export default App;    