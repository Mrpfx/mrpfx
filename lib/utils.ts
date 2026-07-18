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
 * Returns the URL as-is without modifying the host.
 */
export function getMediaUrl(url: string | undefined | null): string | undefined {
    if (!url) return undefined;
    return url;
}

/**
 * Return the URL unchanged — counterpart to getMediaUrl.
 */
export function relativizeMediaUrl(url: string | undefined | null): string {
    return url || '';
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
