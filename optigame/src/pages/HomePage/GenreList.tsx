import { useState } from "react";
import { Spinner, Text, Button, VStack, Collapse, Box } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import useGenres from "../../hooks/useGenres";

interface GenreListProps {
  onGenreSelect: (gameTags: string | null) => void;
}

const GenreList = ({ onGenreSelect }: GenreListProps) => {
  const { data, loading, error } = useGenres();
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  const [showTags, setShowTags] = useState(false);

  if (error) return null;
  if (loading) return <Spinner />;

  return (
    <VStack align="stretch" spacing={2}>
      <Button
        colorScheme="teal"
        variant="ghost"
        fontWeight="bold"
        fontSize="2xl"
        onClick={() => setShowTags((prev) => !prev)}
        mb={2}
        rightIcon={showTags ? <ChevronUpIcon /> : <ChevronDownIcon />}
      >
        Tags
      </Button>
      <Collapse in={showTags} animateOpacity>
        <VStack align="stretch" spacing={2}>
          {data
            .slice()
            .sort((a, b) =>
              a.game_tags.localeCompare(b.game_tags, undefined, {
                sensitivity: "base",
              })
            )
            .map((genre) => (
              <Button
                key={genre.id}
                variant={selectedGenreId === genre.id ? "solid" : "outline"}
                colorScheme="teal"
                borderRadius={8}
                justifyContent="flex-start"
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
      </Collapse>
    </VStack>
  );
};

export default GenreList;
