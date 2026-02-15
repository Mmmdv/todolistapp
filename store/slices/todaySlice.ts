import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface DayData {
    mood?: number;
    weight?: number;
    rating?: number;
}

export interface TodayState {
    daily: Record<string, DayData>;
}

const initialState: TodayState = {
    daily: {}
};

export const todaySlice = createSlice({
    name: "today",
    initialState,
    reducers: {
        setMood: (state, action: PayloadAction<{ date: string, mood: number }>) => {
            const { date, mood } = action.payload;
            if (!state.daily[date]) state.daily[date] = {};
            state.daily[date].mood = mood;
        },
        setWeight: (state, action: PayloadAction<{ date: string, weight: number }>) => {
            const { date, weight } = action.payload;
            if (!state.daily[date]) state.daily[date] = {};
            state.daily[date].weight = weight;
        },
        setRating: (state, action: PayloadAction<{ date: string, rating: number }>) => {
            const { date, rating } = action.payload;
            if (!state.daily[date]) state.daily[date] = {};
            state.daily[date].rating = rating;
        },
        resetMood: (state, action: PayloadAction<{ date: string }>) => {
            const { date } = action.payload;
            if (state.daily[date]) {
                delete state.daily[date].mood;
            }
        }
    }
});

export const { setMood, setWeight, setRating, resetMood } = todaySlice.actions;

export const selectTodayData = (state: RootState) => state.today;
export const selectDayData = (date: string) => (state: RootState) => state.today.daily[date];

export default todaySlice.reducer;
