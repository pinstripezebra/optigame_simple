import { ChangeEvent, FormEvent, useState } from "react";
import { Input, Button } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu"; // Import LuSearch from react-icons

interface SearchProps {
  onSearch: (title: string) => void; // Callback to pass search input
}

const SearchGames = ({ onSearch }: SearchProps) => {
  const [title, setTitle] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value); // Update the title state
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(title); // Pass the title back to the parent component
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Input
        placeholder="Search games..."
        value={title}
        onChange={handleInputChange}
        size="sm"
        width="400px"
        marginRight="10px"
      />
      <IconButton aria-label="Search database">
        <LuSearch />
      </IconButton>
    </form>
  );
};

export default SearchGames;