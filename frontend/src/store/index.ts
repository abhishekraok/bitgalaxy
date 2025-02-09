import { configureStore } from '@reduxjs/toolkit'
import gamesReducer from './slices/gamesSlice'

// You can add your reducers here
const rootReducer = {
    games: gamesReducer
}

export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    })
}

export const store = setupStore()

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = ReturnType<typeof setupStore> 