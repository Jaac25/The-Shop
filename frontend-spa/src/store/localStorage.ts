import { IInfo } from "../features/info/infoSlice";

const STORAGE_KEY = "checkoutInfo";

export const saveToLocalStorage = (state: IInfo) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.error("Error guardando en localStorage", e);
  }
};

export const loadFromLocalStorage = (): IInfo | undefined => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return undefined;
    return JSON.parse(serialized) as IInfo;
  } catch (e) {
    console.error("Error leyendo localStorage", e);
    return undefined;
  }
};
