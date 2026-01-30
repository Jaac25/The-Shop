import { saveToLocalStorage, loadFromLocalStorage } from "./localStorage";
import { IInfo } from "../features/info/infoSlice";

const STORAGE_KEY = "checkoutInfo";

describe("localStorage helpers", () => {
  const mockState: IInfo = {
    product: { idProduct: "1", name: "Prod", price: 100, quantity: 1, image: "" },
    address: "Cra 11 #55",
    dataUser: { name: "Juan", email: "juan@test.com" },
  };

  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("saveToLocalStorage should save state", () => {
    saveToLocalStorage(mockState);
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBe(JSON.stringify(mockState));
  });

  it("loadFromLocalStorage should return saved state", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockState));
    const state = loadFromLocalStorage();
    expect(state).toEqual(mockState);
  });

  it("loadFromLocalStorage should return undefined if nothing saved", () => {
    const state = loadFromLocalStorage();
    expect(state).toBeUndefined();
  });

  it("should handle invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-json");
    const state = loadFromLocalStorage();
    expect(state).toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });
});
