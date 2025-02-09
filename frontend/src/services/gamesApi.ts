import axios from 'axios';
import { GameConfig } from '../types/game';

const API_URL = 'http://localhost:8000/api/v1';

export const gamesApi = {
    generateGame: async (title: string, description?: string) => {
        const response = await axios.post(`${API_URL}/games/generate`, {
            title,
            description,
            game_type: 'simple'
        });
        return response.data;
    },

    getGame: async (gameId: number): Promise<GameConfig> => {
        const response = await axios.get(`${API_URL}/games/${gameId}`);
        return response.data;
    },

    listGames: async (): Promise<GameConfig[]> => {
        const response = await axios.get(`${API_URL}/games`);
        return response.data;
    }
}; 