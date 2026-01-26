/**
 * Steam Store API Integration
 * Fetches game information from Steam's unofficial store API
 */

export interface SteamGameData {
    success: boolean;
    data?: {
        name: string;
        type: string;
        steam_appid: number;
        required_age: number;
        is_free: boolean;
        detailed_description: string;
        about_the_game: string;
        short_description: string;
        header_image: string;
        capsule_image: string;
        capsule_imagev5: string;
        website: string | null;
        developers?: string[];
        publishers?: string[];
        price_overview?: {
            currency: string;
            initial: number;
            final: number;
            discount_percent: number;
            initial_formatted: string;
            final_formatted: string;
        };
        platforms: {
            windows: boolean;
            mac: boolean;
            linux: boolean;
        };
        metacritic?: {
            score: number;
            url: string;
        };
        categories?: Array<{
            id: number;
            description: string;
        }>;
        genres?: Array<{
            id: string;
            description: string;
        }>;
        screenshots?: Array<{
            id: number;
            path_thumbnail: string;
            path_full: string;
        }>;
        release_date: {
            coming_soon: boolean;
            date: string;
        };
    };
}

/**
 * Extract Steam app ID from various Steam URL formats
 * Supports:
 * - https://store.steampowered.com/app/1091500/Cyberpunk_2077/
 * - https://store.steampowered.com/app/1091500/
 * - store.steampowered.com/app/1091500
 */
export function extractSteamAppId(url: string): string | null {
    const patterns = [
        /store\.steampowered\.com\/app\/(\d+)/i,
        /steamcommunity\.com\/app\/(\d+)/i,
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
 * Fetch game information from Steam Store API
 * @param appId - Steam application ID
 * @returns Promise with game data or null if failed
 */
export async function getSteamGameInfo(
    appId: string
): Promise<SteamGameData | null> {
    try {
        const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=schinese&cc=cn`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            console.error(`Steam API error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        const gameData = data[appId] as SteamGameData;

        if (!gameData || !gameData.success) {
            console.error(`Steam game not found or unavailable: ${appId}`);
            return null;
        }

        return gameData;
    } catch (error) {
        console.error(`Error fetching Steam game info for ${appId}:`, error);
        return null;
    }
}

/**
 * Check if a Steam app ID is valid
 */
export function isValidSteamAppId(appId: string): boolean {
    return /^\d+$/.test(appId);
}
