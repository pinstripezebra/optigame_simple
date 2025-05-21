
import { SimpleGrid, Box, IconButton, Spinner, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';
import useSimilarGame from '../../hooks/useSimilarGame';
import { Game } from './GamePage'; // Import the Game type

interface SimilarGamesProps {
  game: Game;
}

const VISIBLE_COUNT = 5;

const SimilarGames = ({ game }: SimilarGamesProps) => {
  const { data: similarGames} = useSimilarGame(game.asin);
  const [startIdx, setStartIdx] = useState(0);

  if (!similarGames || similarGames.length === 0) return <Text>No similar games found.</Text>;

  const handleLeft = () => setStartIdx((prev) => Math.max(prev - 1, 0));
  const handleRight = () =>
    setStartIdx((prev) => Math.min(prev + 1, similarGames.length - VISIBLE_COUNT));

  const visibleGames = similarGames.slice(startIdx, startIdx + VISIBLE_COUNT);

  return (
    <Box display="flex" alignItems="center">
      <IconButton
        aria-label="Previous"
        icon={<ChevronLeftIcon />}
        mr={2}
        variant="outline"
        onClick={handleLeft}
        isDisabled={startIdx === 0}
      />
      <SimpleGrid columns={VISIBLE_COUNT} spacing={4} flex="1">
        {visibleGames.map((simGame) => (
          <Box
            key={simGame.id}
            bg="gray.200"
            height="120px"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Text fontWeight="bold">{simGame.game2}</Text>
            <Text fontSize="sm">Similarity: {simGame.similarity.toFixed(2)}</Text>
          </Box>
        ))}
      </SimpleGrid>
      <IconButton
        aria-label="Next"
        icon={<ChevronRightIcon />}
        ml={2}
        variant="outline"
        onClick={handleRight}
        isDisabled={startIdx >= similarGames.length - VISIBLE_COUNT}
      />
    </Box>
  );
};

export default SimilarGames;