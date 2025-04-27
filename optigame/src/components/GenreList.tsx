import { HStack, Image, List, ListItem, Spinner, Text } from '@chakra-ui/react';
import useGenres from '../hooks/useGenres';



const GenreList = () => {
    const {data, loading, error} = useGenres(); // Fetch genres from the API

  if (error) return null;
  if (loading) return <Spinner/>
  

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