import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromLocalStorage } from "../../store/localStorage";
import { Product } from "../../types/product";
import { TransactionResume } from "../../types/transactions";

export interface IInfo {
  address?: string;
  dataUser?: {name?: string, email?: string};
  product?: Product;
  transaction?: TransactionResume;
}

const persistedState = loadFromLocalStorage();

const initialState: IInfo = persistedState || {
  product: undefined,
  address: "",
  dataUser: undefined,
};

const infoSlice = createSlice({
  name: "info",
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
    setTransaction: (state, action: PayloadAction<IInfo["transaction"]>) => {
      state.transaction = action.payload;
    },
  },
});

export const { setProduct, setAddress , setUser ,setTransaction} =
  infoSlice.actions;

export default infoSlice.reducer;
