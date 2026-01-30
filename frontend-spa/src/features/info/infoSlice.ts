import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/product";
import { loadFromLocalStorage } from "../../store/localStorage";

export interface IInfo {
  address?: string;
  dataUser?: {name?: string, email?: string};
  product?: Product;
}

const persistedState = loadFromLocalStorage();

const initialState: IInfo = persistedState || {
  product: undefined,
  address: "",
  dataUser: undefined,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<Product | undefined>) => {
      state.product = action.payload;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setUser: (state, action: PayloadAction<IInfo["dataUser"]>) => {
      state.dataUser = action.payload;
    },
  },
});

export const { setProduct, setAddress , setUser } =
  productsSlice.actions;

export default productsSlice.reducer;
