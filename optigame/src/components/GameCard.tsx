import {Game} from './GameGrid'
import { Card, Image} from '@chakra-ui/react'
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

    return (
        <Card.Root borderRadius={10} overflow="hidden">
            <Image
                src={imageUrl} // Use the validated or fallback URL
                alt={game.title} // Use the game's title as the alt text
            />
            <Card.Body>
                <Card.Title fontSize="2xl">{game.title}</Card.Title>
                <GameScore rating={game.rating} />
            </Card.Body>
        </Card.Root>
    );
}
export default GameCard