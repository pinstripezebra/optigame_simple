import { useState } from 'react';
import { Image, Spinner, Text, Button, VStack } from '@chakra-ui/react';
import useGenres from '../../hooks/useGenres';
import genreImage from '../assets/placeholder_card.png';

interface GenreListProps {
  onGenreSelect: (gameTags: string | null) => void; 
}

const GenreList = ({ onGenreSelect }: GenreListProps) => {
  const { data, loading, error } = useGenres();
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  
  if (error) return null;
  if (loading) return <Spinner />;

  return (
    <VStack align="stretch" spacing={2}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Top Game Tags
      </Text>
      {data
        .slice()
        .sort((a, b) => a.game_tags.localeCompare(b.game_tags, undefined, { sensitivity: 'base' }))
        .map((genre) => (
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
                src={genreImage}
                alt={genre.game_tags}
              />
            }
            onClick={() => {
              const isSelected = selectedGenreId === genre.id;
              const newSelectedId = isSelected ? null : genre.id;
              setSelectedGenreId(newSelectedId);
              onGenreSelect(isSelected ? null : genre.game_tags);
            }}
          >
            <Text fontSize="lg">{genre.game_tags}</Text>
          </Button>
        ))}
    </VStack>
  );
};

export default GenreList;