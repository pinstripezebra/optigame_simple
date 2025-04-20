import useGenres from '../hooks/UseGenres'


const GenreList = () => {
    const {genres} = useGenres();
  return (
    <ul>
        {genres.map((genre) => (<li key={genre.id}>{genre.game_tages}</li>))}
    </ul>
  )
}

export default GenreList