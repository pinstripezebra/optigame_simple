import {Game} from './GameGrid'
import { Card, Image, Text } from '@chakra-ui/react'
import { GameScore } from './GameScore';

interface Props {
    game: Game
}


const GameCard = ({ game }: Props) => {
  let imageUrl;

    try {
        // Check if the URL is valid and prepend 'https://' if necessary
        imageUrl = game.image_link.startsWith('http') ? game.image_link : `https://${game.image_link}`;
        // Validate the URL using the URL constructor
        imageUrl = new URL(imageUrl).toString();
    } catch {
        // Fallback to a default image if the URL is invalid
        imageUrl = 'https://via.placeholder.com/150';
    }

    // Ensuring the title is not too long for display
    const truncatedTitle = game.title.length > 100 ? `${game.title.slice(0, 100)}...` : game.title;

    return (
        <Card borderRadius={10} overflow="hidden" justifyContent="center" alignItems="center" display = 'flex' padding = '10px'>
            <Image
                src={imageUrl} 
                alt={game.title} 
                boxSize="300px" // Setting width and height to 200px
                fit="cover" // Ensure the image covers the box while maintaining aspect ratio

            />
            <Card display="flex" flexDirection="column" justifyContent="space-between">
                <Text fontSize="2xl">
                    {truncatedTitle}
                </Text>
                <GameScore rating={game.rating} />
            </Card>
        </Card>
    );
}
export default GameCard