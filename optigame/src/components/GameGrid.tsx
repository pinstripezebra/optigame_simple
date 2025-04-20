import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
//import api from '../api';
import api from '../services/api-client';
import { SimpleGrid } from '@chakra-ui/react';
import GameCard from './GameCard';

export interface Game {
  id: string;
  description: string;
  asin: string;
  title: string;
  price: number;
  rating: number;
  sales_volume: string;
  reviews_count: number;
}

const GameGrid = () => {

    //declaring constants
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
      
        
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
        
                <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} gap={10}>
                  {filteredGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </SimpleGrid>
              </div>
            </div>
          );
};


export default GameGrid;