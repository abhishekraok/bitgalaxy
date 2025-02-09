import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { gamesApi } from '../../services/gamesApi'
import { GameConfig } from '../../types/game'

interface Game {
    id: string;
    title: string;
    description?: string;
    created_at: string;
}

interface GamesState {
    availableGames: Game[];
    currentGame: GameConfig | null
    loading: boolean
    error: string | null
}

const initialState: GamesState = {
    availableGames: [],
    currentGame: null,
    loading: false,
    error: null
}

export const generateGame = createAsyncThunk(
    'games/generate',
    async (gameData: { title: string; description: string }) => {
        const response = await fetch('/api/v1/games/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: gameData.title,
                description: gameData.description,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate game');
        }

        return await response.json();
    }
)

export const fetchGames = createAsyncThunk(
    'games/fetchGames',
    async () => {
        return await gamesApi.listGames()
    }
)

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        setCurrentGame: (state, action: PayloadAction<GameConfig>) => {
            state.currentGame = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateGame.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(generateGame.fulfilled, (state, action) => {
                state.loading = false
                state.availableGames.push(action.payload)
            })
            .addCase(generateGame.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'Failed to generate game'
            })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.availableGames = action.payload
            })
    }
})

export const { setCurrentGame } = gamesSlice.actions
export default gamesSlice.reducer 