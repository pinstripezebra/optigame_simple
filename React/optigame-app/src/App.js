import React, { useState, useEffect } from 'react';
import api from './api';

const App = () => {
  const [games, setGames] = useState([]);

  const [FormData, setFormData] = useState({
    id: '',
    asin: '',
    title: '',
    price: 0,
    rating: 0,
    sales_volume: 0,
    reviews_count: 0,
    description: ''  
  });

  const fetchGames = async () => {
    const response = await api.get('/v1/games/');
    setGames(response.data);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (event) => {

    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...FormData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/v1/games/', FormData);
    fetchGames();
    setFormData({
      id: '',
    asin: '',
    title: '',
    price: 0,
    rating: 0,
    sales_volume: 0,
    reviews_count: 0,
    description: ''  
    });
  };

  return (
    <div>
        <nav className="navbar navbar-dark bg-primary">
          <div className="container-fluid">
            <a className='navbar-brand' href="#">
              OptiGame
            </a>
        
          </div>

        </nav>
        <div className="container">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3 mt-3">
              <label htmlFor="id" className="form-label"> 
                id
                
              </label>
                <input type="text"className="form-control" id="id" name="id" value={FormData.name}onChange={handleInputChange}>
                </input>          
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label"> 
                description
                
              </label>
              <input type="text" className="form-control" id="description" name="description" value={FormData.description} onChange={handleInputChange}>
                </input>          
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>


        </div>


    </div>
  )


}
export default App;
