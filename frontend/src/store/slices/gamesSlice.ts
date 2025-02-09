import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GamesState {
    availableGames: string[]
    currentGame: string | null
}

const initialState: GamesState = {
    availableGames: ['collect-stars'],
    currentGame: null
}

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        setCurrentGame: (state, action: PayloadAction<string>) => {
            state.currentGame = action.payload
        }
    }
})

export const { setCurrentGame } = gamesSlice.actions
export default gamesSlice.reducer 