import { baseApi } from "@/store/api/baseApi"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { createTransform, FLUSH, PAUSE, PERSIST, PersistConfig, PURGE, REGISTER, REHYDRATE } from "redux-persist"
import persistReducer from "redux-persist/es/persistReducer"
import appReducer from "./slices/appSlice"
import notificationReducer from "./slices/notificationSlice"
import todoReducer from "./slices/todoSlice"

const reducers = combineReducers({
    app: appReducer,
    todo: todoReducer,
    notification: notificationReducer,
    [baseApi.reducerPath]: baseApi.reducer,
})

export type RootState = ReturnType<typeof reducers>;

const rtkQueryTransform = createTransform(
    (inboundState: any) => {
        return undefined;
    },
    (outboundState: any) => {
        return undefined;
    },
    {
        whitelist: [baseApi.reducerPath],
    }
)

const persistConfig: PersistConfig<RootState> = {
    key: "root",
    storage: AsyncStorage,
    // blacklist: ["app"],
    transforms: [rtkQueryTransform]
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
})

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
