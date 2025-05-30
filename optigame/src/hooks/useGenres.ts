import useData from "./useData";


export interface Genre {
    id: string;
    game_tags: string;
}

const useGenres = () => useData<Genre>("/v1/unique_genres/");


export default useGenres;