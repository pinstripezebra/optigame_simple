import { HStack, Image, List, ListItem, Text } from '@chakra-ui/react';
import useGenres from '../hooks/UseGenres';



const GenreList = () => {
    const {data} = useGenres(); // Fetch genres from the API

    // Ensure genres is defined and is an array before mapping
  if (!data || data.length === 0) {
    return <p>Loading genres...</p>; // Show a loading message or fallback UI
  }

  return (
    <List.Root listStyleType={'none'} padding={0}>
        {data.map((genre) => (
          <ListItem key={genre.id} padding={2} borderWidth={1} borderRadius={8}>
            <HStack>
                <Image boxSize='32px' borderRadius={8} src='/src/assets/placeholder_card.png'></Image>
              <Text fontSize={'lg'}>{genre.game_tags}</Text>
            </HStack>
          </ListItem>))}
    </List.Root>
  )
}

export default GenreList