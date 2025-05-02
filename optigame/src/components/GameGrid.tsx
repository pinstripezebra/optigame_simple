import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import api from "../services/api-client";
import { SimpleGrid } from "@chakra-ui/react";
import GameCard from "./GameCard";

import {
  Button,
  Field,
  Fieldset,
  Input,
} from "@chakra-ui/react";

export interface Game {
  id: string;
  description: string;
  asin: string;
  title: string;
  price: number;
  rating: number;
  sales_volume: string;
  reviews_count: number;
  image_link: string;
}

const GameGrid = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [formData, setFormData] = useState({
    title: "",
  });

  const fetchGames = async () => {
    const response = await api.get<Game[]>("/v1/games/");
    setGames(response.data);
    setFilteredGames(response.data);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Filter games based on the title field
    const filtered = games.filter((game) =>
      formData.title
        ? game.title.toLowerCase().includes(formData.title.toLowerCase())
        : true
    );

    setFilteredGames(filtered);
  };

  return (
    <div>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <Fieldset.Root size="lg" maxW="md">
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Title</Field.Label>
                <Input
                  name="title"
                  id="title"
                  value={formData.title} // Bind the input value to formData.title
                  onChange={handleInputChange} // Update formData on input change
                />
              </Field.Root>
            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start">
              Submit
            </Button>
          </Fieldset.Root>
        </form>

        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={10}>
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
};

export default GameGrid;