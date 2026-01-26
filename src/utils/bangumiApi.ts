/**
 * Bangumi API Integration
 * Fetches anime/manga information from Bangumi (bgm.tv)
 */

export interface BangumiSubject {
    id: number;
    name: string;
    name_cn: string;
    summary: string;
    images?: {
        large: string;
        common: string;
        medium: string;
        small: string;
        grid: string;
    };
    rating?: {
        score: number;
        total: number;
        count: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
        };
    };
    date?: string;
    eps?: number;
    eps_count?: number;
    tags?: Array<{
        name: string;
        count: number;
    }>;
    type: number; // 1=book, 2=anime, 3=music, 4=game, 6=real
}

export interface BangumiResponse {
    id: number;
    type: number;
    name: string;
    name_cn: string;
    summary: string;
    date: string;
    images: {
        large: string;
        common: string;
        medium: string;
        small: string;
        grid: string;
    };
    rating: {
        score: number;
        total: number;
    };
    tags: Array<{
        name: string;
        count: number;
    }>;
    eps?: number;
    eps_count?: number;
}

/**
 * Extract Bangumi subject ID from various URL formats
 * Supports:
 * - https://bgm.tv/subject/310923
 * - https://bangumi.tv/subject/310923
 * - bgm.tv/subject/310923
 */
export function extractBangumiId(url: string): string | null {
    const patterns = [
        /(?:bgm|bangumi)\.tv\/subject\/(\d+)/i,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
}

/**
 * Fetch subject information from Bangumi API
 * @param id - Bangumi subject ID
 * @returns Promise with subject data or null if failed
 */
export async function getBangumiSubject(
    id: string
): Promise<BangumiResponse | null> {
    try {
        const url = `https://api.bgm.tv/v0/subjects/${id}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            console.error(`Bangumi API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        return data as BangumiResponse;
    } catch (error) {
        console.error(`Error fetching Bangumi subject info for ${id}:`, error);
        return null;
    }
}

/**
 * Check if a Bangumi subject ID is valid
 */
export function isValidBangumiId(id: string): boolean {
    return /^\d+$/.test(id);
}

/**
 * Get type name in Chinese
 */
export function getBangumiTypeName(type: number): string {
    switch (type) {
        case 1:
            return '书籍';
        case 2:
            return '动画';
        case 3:
            return '音乐';
        case 4:
            return '游戏';
        case 6:
            return '三次元';
        default:
            return '未知';
    }
}
