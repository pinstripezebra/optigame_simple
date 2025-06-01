import { Checkbox } from "@chakra-ui/react";
import apiClient from "../services/api-client";
import { useUser } from "../context/UserContext";
import { useUserGames } from "../context/UserGamesContext";

interface GameStatusProps {
  asin: string;
}

const GameStatus = ({ asin }: GameStatusProps) => {
  const { username } = useUser();
  const { asins, addAsin, removeAsin } = useUserGames();
  const isChecked = asins.includes(asin);

  return (
    <Checkbox
      size="lg"
      colorScheme="teal"
      isChecked={isChecked}
      onClick={e => e.stopPropagation()}
      onChange={async (e) => {
        if (e.target.checked) {
          await apiClient.post("/v1/user_game/", {
            username: username,
            asin: asin,
          });
          addAsin(asin);
        } else {
          await apiClient.delete("/v1/user_game/", {
            params: { username: username, asin: asin },
          });
          removeAsin(asin);
        }
      }}
    >
      Your Collection
    </Checkbox>
  );
};

export default GameStatus;