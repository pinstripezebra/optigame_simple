
import { SimpleGrid, Box, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';

const TOTAL_CARDS = 10; // Example total cards

const SimilarGames = () => {
    const [startIdx, setStartIdx] = useState(0);
    const visibleCount = 5;

    const handleLeft = () => {
        setStartIdx((prev) => Math.max(prev - 1, 0));
    };

    const handleRight = () => {
        setStartIdx((prev) => Math.min(prev + 1, TOTAL_CARDS - visibleCount));
    };

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
            <SimpleGrid columns={visibleCount} spacing={4} flex="1">
                {[...Array(visibleCount)].map((_, idx) => {
                    const cardIdx = startIdx + idx;
                    return (
                        <Box
                            key={cardIdx}
                            bg="gray.200"
                            height="120px"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            Card {cardIdx + 1}
                        </Box>
                    );
                })}
            </SimpleGrid>
            <IconButton
                aria-label="Next"
                icon={<ChevronRightIcon />}
                ml={2}
                variant="outline"
                onClick={handleRight}
                isDisabled={startIdx >= TOTAL_CARDS - visibleCount}
            />
        </Box>
    );
};

export default SimilarGames;