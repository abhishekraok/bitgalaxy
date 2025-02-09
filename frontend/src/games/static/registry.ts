import { GameConfig } from 'phaser'

export interface StaticGameInfo {
    id: string;
    title: string;
    description: string;
    getConfig: () => Promise<{ default: GameConfig }>;
}

export const staticGames: StaticGameInfo[] = [
    {
        id: 'collect-stars',
        title: 'Collect Stars',
        description: 'Collect stars while avoiding bombs',
        // Using dynamic import for lazy loading
        getConfig: () => import('./collect-stars/config')
    },
    // Add more games here following the same pattern
]; 