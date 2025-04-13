import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button, ButtonGroup } from "@chakra-ui/react"
import api from './api';
import ListGroup from './components/ListGroup';
import Alert from './components/Alert';


// Define the type for a game object

const App = () => {
  interface Game {
    id: string;
    description: string;
    asin: string;
    title: string;
    price: number;
    rating: number;
    sales_volume: string;
    reviews_count: number;
  }

  //declaring constants
  let items = ["monopoly", "chess", "poker", "uno", "scrabble"];
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]); // State for filtered data
  const [FormData, setFormData] = useState({
    id: '',
    description: '',
    asin: '',
    title: '',
    price: 0,
    rating: 0,
    sales_volume: '',
    reviews_count: 0,
  });

  // Function to handle item selection
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  const fetchGames = async () => {
    const response = await api.get('/v1/games/');
    setGames(response.data);
    setFilteredGames(response.data); // Initialize filteredGames with all data
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...FormData,
      [name]: value,
    });
  };


  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Filter games based on title or description
    const filtered = games.filter((game) => {
      const matchesTitle = FormData.title
        ? game.title.toLowerCase().includes(FormData.title.toLowerCase())
        : true;
      const matchesDescription = FormData.description
        ? game.description.toLowerCase().includes(FormData.description.toLowerCase())
        : true;
      return matchesTitle && matchesDescription;
    });

    setFilteredGames(filtered);
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            OptiGame
          </a>
          <div>
            <ListGroup items = {items} heading = "Games" onSelectItem={handleSelectItem }/>
          </div>
          <div>
            
            <Button>Click me</Button>
            
          </div>
        </div>
      </nav>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={FormData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              value={FormData.description}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">id</th>
              <th scope="col">description</th>
              <th scope="col">asin</th>
              <th scope="col">title</th>
              <th scope="col">price</th>
              <th scope="col">rating</th>
              <th scope="col">sales_volume</th>
              <th scope="col">reviews_count</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames?.map((game) => (
              <tr key={game.id}>
                <td>{game.id}</td>
                <td>{game.description}</td>
                <td>{game.asin}</td>
                <td>{game.title}</td>
                <td>{game.price}</td>
                <td>{game.rating}</td>
                <td>{game.sales_volume}</td>
                <td>{game.reviews_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;