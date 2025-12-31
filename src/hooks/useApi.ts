import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api-client';
import type { ApiError } from '../lib/api-client';

interface UseApiOptions {
    /**
     * If true, the request will be made immediately on mount
     */
    immediate?: boolean;

    /**
     * Callback to run on success
     */
    onSuccess?: (data: any) => void;

    /**
     * Callback to run on error
     */
    onError?: (error: ApiError) => void;
}

interface UseApiResult<T> {
    data: T | null;
    error: ApiError | null;
    isLoading: boolean;
    refetch: () => Promise<void>;
}

/**
 * Custom hook for making API calls with loading and error states
 * 
 * @param endpoint - API endpoint to call
 * @param method - HTTP method (GET, POST, etc.)
 * @param body - Request body (for POST, PUT, PATCH)
 * @param options - Additional options
 * 
 * @example
 * const { data, isLoading, error, refetch } = useApi('/user/profile', 'GET', null, { immediate: true });
 */
export function useApi<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body?: any,
    options: UseApiOptions = {}
): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<ApiError | null>(null);
    const [isLoading, setIsLoading] = useState(options.immediate ?? false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

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

            setData(result);
            options.onSuccess?.(result);
        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError);
            options.onError?.(apiError);
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, method, body, options]);

    useEffect(() => {
        if (options.immediate) {
            fetchData();
        }
    }, [options.immediate, fetchData]);

    return {
        data,
        error,
        isLoading,
        refetch: fetchData,
    };
}

/**
 * Custom hook for fetching data on mount (convenience wrapper for GET requests)
 * 
 * @example
 * const { data, isLoading, error } = useFetch('/user/portfolio');
 */
export function useFetch<T = any>(endpoint: string, params?: Record<string, any>): UseApiResult<T> {
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

/**
 * Custom hook for mutations (POST, PUT, DELETE)
 * Returns a mutate function to call manually
 * 
 * @example
 * const { mutate, isLoading } = useMutation('/api/properties', 'POST');
 * await mutate({ name: 'New Property', ... });
 */
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

    return {
        mutate,
        data,
        error,
        isLoading,
        reset: () => {
            setData(null);
            setError(null);
        },
    };
}

export default useApi;
