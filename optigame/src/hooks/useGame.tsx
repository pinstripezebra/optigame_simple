import useData from "./useData";

export interface Game {
    id: string;
    title: string
    description: string;
    price: number;
    rating: number;
    sales_volume: string;
    reviews_count: number;
    asin: string;
    image_link: string;
    
}

const useGame = (asin: string | undefined) => {
    // Only fetch if asin is provided
    const result = asin
        ? useData<Game>(`/v1/games?asin=${asin}`)
        : { data: [], isLoading: false, error: null };

   
    return { data: result};
};

export default useGame;