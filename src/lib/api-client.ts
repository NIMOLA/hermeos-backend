/**
 * Centralized API Client for Hermeos Platform
 * Handles authentication, error handling, and request/response interceptors
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    errors?: Array<{ field: string; message: string }>;
    statusCode: number;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * Get auth token from localStorage
     */
    private getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    /**
     * Build headers with authentication
     */
    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * Handle API errors
     */
    private async handleError(response: Response): Promise<never> {
        let errorData: any;

        try {
            errorData = await response.json();
        } catch {
            errorData = { message: response.statusText };
        }

        // Handle 401 Unauthorized - clear auth and redirect to login
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        const error: ApiError = {
            message: errorData.message || 'An error occurred',
            errors: errorData.errors,
            statusCode: response.status,
        };

        throw error;
    }

    /**
     * Generic request method
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                await this.handleError(response);
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            // Re-throw ApiError
            if ((error as ApiError).statusCode) {
                throw error;
            }

            // Network or other errors
            throw {
                message: 'Network error. Please check your connection.',
                statusCode: 0,
            } as ApiError;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        let url = endpoint;

        if (params) {
            const queryString = new URLSearchParams(
                Object.entries(params).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>)
            ).toString();

            if (queryString) {
                url += `?${queryString}`;
            }
        }

        return this.request<T>(url, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    /**
     * Upload file (multipart/form-data)
     */
    async upload<T>(endpoint: string, formData: FormData): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const headers: HeadersInit = {};
        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        // Don't set Content-Type for FormData - browser will set it with boundary

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            await this.handleError(response);
        }

        return response.json();
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export default
export default apiClient;
