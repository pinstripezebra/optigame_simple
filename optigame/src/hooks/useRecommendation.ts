import { useMemo } from "react";
import useData from "./useData";

export interface Reccommendation {
    id: string;
    username: string;
    asin: string;
    similarity: number;
}

const useRecommendation = (username: string | undefined) => {
    const result = username
        ? useData<Reccommendation>(`/v1/user_recommended_game?username=${username}`)
        : { data: [], isLoading: false, error: null };

    const topRecommendedGames = useMemo(
        () =>
            result.data && Array.isArray(result.data)
                ? [...result.data].sort((a, b) => b.similarity - a.similarity).slice(0, 20)
                : [],
        [result.data]
    );

    // Memoize asins so it only changes when topRecommendedGames changes
    const asins = useMemo(
        () => topRecommendedGames.map(game => game.asin),
        [topRecommendedGames]
    );

    const { data, ...rest } = result;
    return { data: topRecommendedGames, asins, ...rest };
};

export default useRecommendation;