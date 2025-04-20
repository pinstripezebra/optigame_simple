import { Badge } from '@chakra-ui/react'

interface GameScoreProps {
    rating: number
    
    }

export const GameScore = ({rating}: GameScoreProps) => {

    let color = rating > 4.5 ? 'green' : rating > 4.0 ? 'yellow' : 'red';

  return (
    <Badge colorPalette = {color} fontSize='18px' borderRadius='4px'>{rating}</Badge>
  )
}
