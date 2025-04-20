import useGenres from '../hooks/UseGenres'


const GenreList = () => {
    const {genres} = useGenres();

    // Ensure genres is defined and is an array before mapping
  if (!genres || genres.length === 0) {
    return <p>Loading genres...</p>; // Show a loading message or fallback UI
  }

  return (
    <ul>
        {genres.map((genre) => (<li key={genre.id}>{genre.game_tags}</li>))}
    </ul>
  )
}

export default GenreList