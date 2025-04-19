import {Game} from './GameGrid'
import { Card, CardBody, Image } from '@chakra-ui/react'

interface Props {
    game: Game
}


const GameCard = ({game}: Props) => {
  return (
    <Card.Root>
        <Image>
            src = {'../assets/placeholder_card.jpg'}
        </Image>

        <CardBody>
            <Card.Title>{game.title}</Card.Title>
        </CardBody>

    </Card.Root>
  )
}

export default GameCard