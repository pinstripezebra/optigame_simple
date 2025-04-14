import { Grid, GridItem} from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import GameGrid from "./components/GameGrid";

function App() {
  return (
    <Grid
      templateAreas={{base: `"nav" "main"`,
                      lg: `"nav nav" "aside main"`
                      }}>
        <GridItem area = 'nav'>
            <NavBar/>
        </GridItem>
        <GridItem area = 'aside' bg = 'gold'>Aside Text</GridItem>
        <GridItem area = 'main' bg = 'dodgerblue'>
            <GameGrid/>
        </GridItem>
      {/* Your components go here */}
    </Grid>
  );
}

export default App;