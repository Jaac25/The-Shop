import { configureStore } from "@reduxjs/toolkit";
import infoReducer, { IInfo } from "../features/info/infoSlice";
import { saveToLocalStorage } from "./localStorage";

export const store = configureStore({
  reducer: {
    info: infoReducer,
  },
});

// Guardar cada vez que cambia
store.subscribe(() => {
  const state: IInfo = store.getState().info;
  saveToLocalStorage(state);
});

// tipos globales
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
