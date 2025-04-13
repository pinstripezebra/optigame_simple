import { Grid, GridItem} from "@chakra-ui/react";

function App() {
  return (
    <Grid
      templateAreas={{base: `"nav" "main"`,
                      lg: `"nav nav" "aside main"`
                      }}>
        <GridItem area = 'nav' bg = 'coral'>Nav Text</GridItem>
        <GridItem area = 'aside' bg = 'gold'>Aside Text</GridItem>
        <GridItem area = 'main' bg = 'dodgerblue'>Main Text</GridItem>
      {/* Your components go here */}
    </Grid>
  );
}

export default App;