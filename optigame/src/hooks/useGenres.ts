import { useState, useEffect} from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";


interface Genre {
    id: number;
    asin: string;
    game_tages: string;
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
        apiClient.get<FetchGameGenres>("/v1/genres", {signal: controller.signal})
            .then((res) => {
                setGameGenres(res.data.results);
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