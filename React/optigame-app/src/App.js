import React, { useState, useEffect } from 'react';
import api from './api';

const App = () => {
  const [games, setGames] = useState([]);

  const [FormData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    price: 0,
    stock: 0,
    isActive: false,
  });

  const fetchGames = async () => {
    const response = await api.get('/api/v1/games/');
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
    await api.post('/api/v1/games/', FormData);
    fetchGames();
    setFormData({
      name: '',
      description: '',
      image: '',
      price: 0,
      stock: 0,
      isActive: false,
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
            <div className="mb-3">
              <label htmlFor="name" className="form-label"> 
                Name
                
              </label>
              
            </div>
          </form>


        </div>


    </div>
  )


}
export default App;
