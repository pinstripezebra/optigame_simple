import {Game} from './GameGrid'
import { Button, Card, Image, Text } from '@chakra-ui/react'

interface Props {
    game: Game
}


const GameCard = ({game}: Props) => {
  return (
    <Card.Root>

        <Image
        height="200px"
        backgroundImage={'../assets/placeholder_card.png'}
      />
      <Card.Body>
            <Card.Title>{game.title}</Card.Title>
        </Card.Body>


    </Card.Root>
  )
}

export default GameCard