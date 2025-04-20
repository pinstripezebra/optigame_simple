import { useState, useEffect} from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";


interface Genre {
    id: string;
    game_tags: string;
}

interface FetchGameGenres {
    count: number;
    results: Genre[];
}

const useGenres = () => {
    const [genres, setGameGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        apiClient.get<FetchGameGenres>("/v1/unique_genres", {signal: controller.signal})
            .then((res) => {
                console.log("API Response:", res.data); // Log the response
                if (res.data && Array.isArray(res.data)) {
                    setGameGenres(res.data); // Parse and set the genres
                } else {
                    console.error("Unexpected API response format:", res.data);
                }
                setLoading(false);
            }).catch((err) => {
                if (err instanceof CanceledError) return;
                setError(err.message);
                setLoading(false);
            });

        return () => controller.abort();
    }, []);

    return { genres, loading, error };
};

export default useGenres;