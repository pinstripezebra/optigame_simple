import { useState } from 'react';
import { HStack, Image, Spinner, Text, Button, VStack } from '@chakra-ui/react';
import useGenres from '../hooks/useGenres';

const GenreList = () => {
  const { data, loading, error } = useGenres(); // Fetch genres from the API
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);

  if (error) return null;
  if (loading) return <Spinner />;

  return (
    <VStack align="stretch" spacing={2}>
      {data.map((genre) => (
        <Button
          key={genre.id}
          variant={selectedGenreId === genre.id ? "solid" : "outline"}
          colorScheme="teal"
          borderRadius={8}
          justifyContent="flex-start"
          leftIcon={
            <Image
              boxSize="32px"
              borderRadius={8}
              src="/src/assets/placeholder_card.png"
              alt={genre.game_tags}
            />
          }
          onClick={() =>
            setSelectedGenreId(
              selectedGenreId === genre.id ? null : genre.id
            )
          }
        >
          <Text fontSize="lg">{genre.game_tags}</Text>
        </Button>
      ))}
    </VStack>
  );
};

export default GenreList;