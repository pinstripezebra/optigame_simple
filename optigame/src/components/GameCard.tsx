import {Game} from './GameGrid'
import { Button, Card, Image, Text } from '@chakra-ui/react'
import { GameScore } from './GameScore';

interface Props {
    game: Game
}


const GameCard = ({ game }: Props) => {
    return (
      <Card.Root borderRadius={10} overflow = "hidden">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt="Green double couch with wooden legs"
        />
        <Card.Body>
          <Card.Title fontSize='2xl'>{game.title}</Card.Title>
          <GameScore rating = {game.rating}/>   
        </Card.Body>
      </Card.Root>
    );
}
export default GameCard