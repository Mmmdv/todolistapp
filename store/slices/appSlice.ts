import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Lang {
    EN = "en",
    RU = "ru",
    AZ = "az"
}

export interface AppState {
    lang: Lang
}

const initialState: AppState = {
    lang: Lang.EN
}

export interface UpdateAppSettingsPayload {
    lang: Lang
}

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        updateAppSetting: (
            state: AppState,
            action: PayloadAction<UpdateAppSettingsPayload>
        ) => {
            const { lang } = action.payload;
            state.lang = lang
        },
    },
})

export const { updateAppSetting } = appSlice.actions

export const selectAppSettings = (state: { app: AppState }): AppState => state.app

export default appSlice.reducer 