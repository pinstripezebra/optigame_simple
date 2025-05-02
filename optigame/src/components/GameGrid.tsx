import { SimpleGrid } from "@chakra-ui/react";
import GameCard from "./GameCard";

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

interface GameGridProps {
  games: Game[]; // Filtered games passed from the parent
}

const GameGrid = ({ games }: GameGridProps) => {
  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={10}>
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </SimpleGrid>
  );
};

export default GameGrid;