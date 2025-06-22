import useData from "./useData";

export interface Reccommendation {
    id: string;
    username: string;
    asin: string;
    similarity: number;
}

const useRecommendation = (username: string | undefined) => {
    // Only fetch if username is provided
    const result = username
        ? useData<Reccommendation>(`/v1/similar_games?username=${username}`)
        : { data: [], isLoading: false, error: null };

    const topRecommendedGames = result.data && Array.isArray(result.data)
        ? [...result.data].sort((a, b) => b.similarity - a.similarity).slice(0, 20)
        : [];

    // Extract just the asin values
    const asins = topRecommendedGames.map(game => game.asin);

    // Exclude 'data' from result to avoid duplicate keys
    const { data, ...rest } = result;
    return { data: topRecommendedGames, asins, ...rest };
};

export default useRecommendation;