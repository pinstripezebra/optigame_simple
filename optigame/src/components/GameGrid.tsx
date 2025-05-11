import { SimpleGrid } from "@chakra-ui/react";
import GameCard from "./GameCard";
import GameCardSkeleton from "./GameCardSkeleton";

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
  error: string | null; // Error message
  loading: boolean; // Loading state
}

const GameGrid = ({ games, error, loading }: GameGridProps) => {

  const skeletons = [1, 2, 3, 4, 5, 6];
  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={10}>
      {loading &&
        skeletons.map((skeleton) => (
          <GameCardSkeleton key={skeleton} />
        ))}
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </SimpleGrid>
  );
};

export default GameGrid;