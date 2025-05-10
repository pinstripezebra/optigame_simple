import useData from "./useData";


export interface UserGame {
    id: string;
    use_id: string;
    asin: string;
}

const useUserGame = () => useData<UserGame>("/v1/user_game");


export default useUserGame;