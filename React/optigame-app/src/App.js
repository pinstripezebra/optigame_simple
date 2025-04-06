import React, { useState, useEffect } from 'react';
import api from './api';

const App = () => {
  const [games, setGames] = useState([]);

}

const fetchGames = async () => {
  const response = await api.get('/games');
  setGames(response.data);
}

useEffect(() => {
  fetchGames();
}, []);

export default App;
