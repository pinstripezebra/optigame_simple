import React, { useEffect, useState } from "react";
import { SimpleGrid, Box, IconButton, Spinner, Text } from "@chakra-ui/react";
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import apiClient from "../../services/api-client";
import UserRecommendedCard from "./UserRecommendedCard";
import useRecommendation from "../../hooks/useRecommendation";
import { useUser } from "../../context/UserContext";

const VISIBLE_COUNT = 5;

const RecommendedShelf = () => {
  const { username } = useUser();
  const { asins, error: recError } = useRecommendation(username);
  const [games, setGames] = useState<any[]>([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [startIdx, setStartIdx] = useState(0);

  useEffect(() => {
    if (asins && asins.length > 0) {
      setLoadingGames(true);
      Promise.all(
        asins.map((asin) =>
          apiClient
            .get(`/v1/games/?asin=${encodeURIComponent(asin)}`)
            .then((res) => res.data)
        )
      )
        .then((gamesArr) => setGames(gamesArr))
        .catch(() => setGames([]))
        .finally(() => setLoadingGames(false));
    } else {
      setGames([]);
    }
  }, [asins]);

  if (recError) return <Text>Error loading recommendations.</Text>;
  if (!games || games.length === 0)
    return <Text>No recommended games found.</Text>;

  const handleLeft = () => setStartIdx((prev) => Math.max(prev - 1, 0));
  const handleRight = () =>
    setStartIdx((prev) => Math.min(prev + 1, games.length - VISIBLE_COUNT));
  console.log("Games:", games);


const flatGames = games.flat();
const visibleGames = flatGames.slice(startIdx, startIdx + VISIBLE_COUNT);


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
      {visibleGames.map((game) => (
        <UserRecommendedCard key={game.id || game.asin} game={game} />
      ))}
    </SimpleGrid>
    <IconButton
      aria-label="Next"
      icon={<ChevronRightIcon />}
      ml={2}
      variant="outline"
      onClick={handleRight}
      isDisabled={startIdx >= flatGames.length - VISIBLE_COUNT}
    />
  </Box>
);
};

export default RecommendedShelf;
