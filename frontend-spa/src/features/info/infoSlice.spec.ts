import reducer, { setProduct, setAddress, setUser, IInfo } from "./infoSlice";
import { Product } from "../../types/product";

describe("productsSlice", () => {
  const initialState: IInfo = {
    product: undefined,
    address: "",
    dataUser: undefined,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setProduct", () => {
    const product: Product = {
      idProduct: "1",
      name: "Producto 1",
      price: 100,
      quantity: 1,
      image: "",
    };
    const nextState = reducer(initialState, setProduct(product));
    expect(nextState.product).toEqual(product);
  });

  it("should handle setAddress", () => {
    const nextState = reducer(initialState, setAddress("Cra 11 # 55"));
    expect(nextState.address).toBe("Cra 11 # 55");
  });

  it("should handle setUser", () => {
    const user = { name: "Juan", email: "juan@test.com" };
    const nextState = reducer(initialState, setUser(user));
    expect(nextState.dataUser).toEqual(user);
  });
});
