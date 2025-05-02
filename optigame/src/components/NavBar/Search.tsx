import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Field, Fieldset, Input } from "@chakra-ui/react";

interface SearchProps {
  onSearch: (title: string) => void; // Callback to pass the search criteria
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
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Title</Field.Label>
            <Input
              name="title"
              id="title"
              value={title} // Bind the input value to the title state
              onChange={handleInputChange} // Update the title state on input change
            />
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" alignSelf="flex-start">
          Submit
        </Button>
      </Fieldset.Root>
    </form>
  );
};

export default SearchGames;