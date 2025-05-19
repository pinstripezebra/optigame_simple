import useData from "./useData";


export interface Genre {
    id: string;
    asin: string;
    game_tags: string;
}

const useGenres = () => useData<Genre>("/v1/genres_filtered");


export default useGenres;