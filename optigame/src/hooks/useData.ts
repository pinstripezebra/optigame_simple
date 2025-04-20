import { useState, useEffect} from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";



interface FetchResponse<T> {
    count: number;
    results: T[];
}

const useData = <T>(endpoint: string) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        apiClient.get<FetchResponse<T>>(endpoint, {signal: controller.signal})
            .then((res) => {
                console.log("API Response:", res.data); // Log the response
                if (res.data && Array.isArray(res.data)) {
                    setData(res.data); // Parse and set the genres
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

    return { data, loading, error };
};

export default useData;