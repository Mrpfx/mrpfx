/**
 * Utility functions for the application
 */

/**
 * Generate a URL-friendly slug from a string
 * @param text The text to slugify
 * @returns The slugified string
 */
export function generateSlug(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-');     // Replace multiple - with single -
}

/**
 * Get the full URL for a media item
 * Handles both absolute and relative URLs
 */

export function getMediaUrl(url: string | undefined | null): string | undefined {
    if (!url) return undefined;

    // If it's already a full URL, handle localhost/127.0.0.1 replacements
    if (url.startsWith('http')) {
        const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'https://mrpfx-backend.onrender.com';
        const baseUrl = apiBase.replace(/\/api\/v1\/?$/, '');

        // If it starts with localhost/127.0.0.1 but our baseUrl is different, replace it
        const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
        const isBaseLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

        if (isLocal && !isBaseLocal) {
            try {
                const urlObj = new URL(url);
                return `${baseUrl}${urlObj.pathname}${urlObj.search}`;
            } catch (e) {
                return url;
            }
        }
        return url;
    }

    // For relative paths, check if it's a local static asset
    if (url.startsWith('/assets/') || url.startsWith('/images/') || url.startsWith('/favicon.ico')) {
        return url;
    }

    // For other relative paths (like /wp-content/), prepend the backend host
    const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'https://mrpfx-backend.onrender.com';
    const baseUrl = apiBase.replace(/\/api\/v1\/?$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
}

/**
 * Remove the backend base URL from an absolute URL to save a relative path.
 * This ensures that data saved in the database is environment-agnostic.
 */
export function relativizeMediaUrl(url: string | undefined | null): string {
    if (!url) return '';
    if (!url.startsWith('http')) return url;

    try {
        const urlObj = new URL(url);
        const isMedia = url.includes('/wp-content/') || url.includes('/media/');
        const isLocal = url.includes('localhost') || url.includes('127.0.0.1');

        // If it's a media URL or a local URL, we want to relativize it
        if (isMedia || isLocal) {
            return `${urlObj.pathname}${urlObj.search}`;
        }
    } catch (e) {
        console.error('Failed to parse URL for relativization:', url);
    }

    return url;
}

/**
 * Truncate a string by words
 * @param text The text to truncate
 * @param limit The maximum number of words
 * @returns The truncated string
 */
export function truncateWords(text: string | undefined | null, limit: number = 25): string {
    if (!text) return "";
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
}
