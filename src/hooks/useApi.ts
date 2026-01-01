import { useState, useEffect, useCallback } from 'react';
import apiClient, { ApiError } from '../lib/api-client';

type UseApiResult<T> = {
    data: T | null;
    error: ApiError | null;
    isLoading: boolean;
    refetch: () => Promise<void>;
};

export function useApi<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body: any = null,
    options: { immediate?: boolean; onSuccess?: (res: T) => void; onError?: (err: ApiError) => void } = {}
): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const [isLoading, setIsLoading] = useState(options.immediate ?? false);

    // Use stable JSON body string for deps to avoid re-creating the callback each render
    const bodyJSON = body ? JSON.stringify(body) : null;

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        let active = true; // ignore stale responses if unmounted or a newer fetch started
        try {
            let result: T;

            switch (method) {
                case 'GET':
                    result = await apiClient.get<T>(endpoint);
                    break;
                case 'POST':
                    result = await apiClient.post<T>(endpoint, body);
                    break;
                case 'PUT':
                    result = await apiClient.put<T>(endpoint, body);
                    break;
                case 'PATCH':
                    result = await apiClient.patch<T>(endpoint, body);
                    break;
                case 'DELETE':
                    result = await apiClient.delete<T>(endpoint);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
            }

            // Only update state if this fetch is still active
            if (!active) return;

            setData(result);
            options.onSuccess?.(result);
        } catch (err) {
            if (!active) return;
            const apiError = err as ApiError;
            setError(apiError);
            options.onError?.(apiError);
        } finally {
            if (!active) return;
            setIsLoading(false);
        }

        // cleanup function marker
        return () => {
            active = false;
        };
    }, [endpoint, method, bodyJSON, options.onSuccess, options.onError]);

    useEffect(() => {
        let cancelled = false;
        if (options.immediate) {
            // Call fetchData and ensure late / stale responses are ignored
            const run = async () => {
                await fetchData();
                if (cancelled) {
                    // noop - response will be ignored by fetchData's active flag
                }
            };
            run();
        }
        return () => {
            cancelled = true;
        };
    }, [options.immediate, fetchData]);

    return {
        data,
        error,
        isLoading,
        refetch: fetchData,
    };
}

export function useFetch<T = any>(endpoint: string, params?: Record<string, any>) {
    const queryString = params
        ? `?${new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null) {
                    acc[key] = String(value);
                }
                return acc;
            }, {} as Record<string, string>)
        ).toString()}`
        : '';

    return useApi<T>(`${endpoint}${queryString}`, 'GET', null, { immediate: true });
}

export function useMutation<T = any, B = any>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const mutate = useCallback(
        async (body?: B): Promise<T | null> => {
            setIsLoading(true);
            setError(null);

            try {
                let result: T;

                switch (method) {
                    case 'POST':
                        result = await apiClient.post<T>(endpoint, body);
                        break;
                    case 'PUT':
                        result = await apiClient.put<T>(endpoint, body);
                        break;
                    case 'PATCH':
                        result = await apiClient.patch<T>(endpoint, body);
                        break;
                    case 'DELETE':
                        result = await apiClient.delete<T>(endpoint);
                        break;
                    default:
                        throw new Error(`Unsupported method: ${method}`);
                }

                setData(result);
                return result;
            } catch (err) {
                const apiError = err as ApiError;
                setError(apiError);
                throw apiError;
            } finally {
                setIsLoading(false);
            }
        },
        [endpoint, method]
    );

    return { mutate, data, error, isLoading };
}
