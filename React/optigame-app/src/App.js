import React, { useState, useEffect } from 'react';
import api from './api';
import Message from './message'; // Import the Message component

const App = () => {
  const [games, setGames] = useState([]);

  const [filteredGames, setFilteredGames] = useState([]); // State for filtered data

  const [FormData, setFormData] = useState({
    title: '',
    description: '',
  });

  const fetchGames = async () => {
    const response = await api.get('/v1/games/');
    setGames(response.data);
    setFilteredGames(response.data); // Initialize filteredGames with all data
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (event) => {

    const value = event.target.value;
    setFormData({
      ...FormData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Filter games based on id or description
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
            <Message></Message>
          </div>
        </div>
      </nav>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="id" className="form-label">
              title
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
              description
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
            {filteredGames.map((game) => (
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