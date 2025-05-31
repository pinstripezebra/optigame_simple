import useData from "./useData";

export interface SimilarGame {
    id: string;
    game1: string;
    game2: string;
    similarity: number;
}

const useSimilarGame = (asin: string | undefined) => {
    // Only fetch if asin is provided
    const result = asin
        ? useData<SimilarGame>(`/v1/similar_games?asin=${asin}/`)
        : { data: [], isLoading: false, error: null };

    // Sort by similarity descending and take top 20
    const topSimilarGames = result.data && Array.isArray(result.data)
        ? [...result.data].sort((a, b) => b.similarity - a.similarity).slice(0, 20)
        : [];

    // Exclude 'data' from result to avoid duplicate keys
    const { data, ...rest } = result;
    return { data: topSimilarGames, ...rest };
};

export default useSimilarGame;