import { useState } from "react";
import { Spinner, Text, Button, VStack, Collapse } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import useGenres from "../../hooks/useGenres";

interface GenreListProps {
  onGenreSelect: (gameTags: string | null) => void;
  onSortSelect: (sortType: string) => void; // Add this line
}


const GenreList = ({ onGenreSelect, onSortSelect }: GenreListProps) => {
  const { data, loading, error } = useGenres();
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  const [showTags, setShowTags] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  if (error) return null;
  if (loading) return <Spinner />;

  const handleSortClick = (sortType: string) => {
    if (selectedSort === sortType) {
      setSelectedSort(null);
      onSortSelect(""); // Unselect
    } else {
      setSelectedSort(sortType);
      onSortSelect(sortType);
    }
  };

  return (
    <VStack align="stretch" spacing={2}>
      {/* Sort By Button */}
      {/* Sort By Button */}
        <Button
        colorScheme="teal"
        variant="ghost"
        fontWeight="bold"
        fontSize="2xl"
        onClick={() => setShowSort((prev) => !prev)}
        mb={2}
        rightIcon={showSort ? <ChevronUpIcon /> : <ChevronDownIcon />}
      >
        Sort By
      </Button>
      <Collapse in={showSort} animateOpacity>
        <VStack align="stretch" spacing={2} mb={2}>
          <Button
            colorScheme="teal"
            variant={selectedSort === "most_popular" ? "solid" : "outline"}
            onClick={() => handleSortClick("most_popular")}
          >
            Most Popular
          </Button>
          <Button
            colorScheme="teal"
            variant={selectedSort === "trending" ? "solid" : "outline"}
            onClick={() => handleSortClick("trending")}
          >
            Trending
          </Button>
          <Button
            colorScheme="teal"
            variant={selectedSort === "recommended" ? "solid" : "outline"}
            onClick={() => handleSortClick("recommended")}
          >
            Reccommended
          </Button>
        </VStack>
      </Collapse>

      {/* Tags Button */}
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