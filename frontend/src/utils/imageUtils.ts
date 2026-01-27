
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Constructs a full URL for an image path.
 * Handles:
 * 1. Absolute URLs (http/https) -> returns as is
 * 2. Relative paths (/uploads/...) -> prepends API base URL
 * 3. Null/Undefined -> returns placeholder
 */
export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return 'https://placehold.co/600x400?text=No+Image';

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Ensure path starts with / if it doesn't
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Remove trailing slash from base if present to avoid double slashes
    const baseUrl = API_BASE_URL.replace(/\/$/, '');

    return `${baseUrl}${cleanPath}`;
};
