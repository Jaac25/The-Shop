import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import useSWR from "swr";
import { useAppDispatch, useAppSelector } from "../core/hooks/useRedux";
import { Product } from "../types/product";
import { ProductsPage } from "./ProductsPage";

const products = [
  {
    idProduct: "1",
    name: "Producto 1",
    price: 125000,
    quantity: 1,
    image: "",
  },
  {
    idProduct: "2",
    name: "Producto 2",
    price: 200000,
    quantity: 250,
    image: "",
  },
  {
    idProduct: "3",
    name: "Producto 3",
    price: 3200000,
    quantity: 0,
    image: "",
  },
];

jest.mock("swr");
jest.mock("../core/hooks/useRedux");
const mockDispatch = jest.fn();

const mockedUseSWR = useSWR as jest.Mock;

jest.mock("../app/providers", () => ({
  __esModule: true,
  request: {
    post: jest.fn(() =>
      Promise.resolve({ status: 200, data: { success: true } }),
    ),
  },
  fetcher: jest.fn(),
}));

jest.mock("../config/env", () => ({
  ENV: {
    HOST: "http://localhost:5173",
    WOMPI_ENVIRONMENT: "sandbox",
    WOMPI_PUBLIC_KEY: "fake_public_key",
  },
}));

jest.mock("../components/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock("framer-motion", () => {
  return {
    motion: {
      div: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe("renders products page", () => {
  beforeEach(() => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        info: {
          dataUser: undefined,
          address: "",
          product: undefined,
        },
      }),
    );
    mockedUseSWR.mockReturnValue({
      data: products,
      isLoading: false,
      mutate: jest.fn(),
      error: undefined,
    });
    render(<ProductsPage />);
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });
  it("renders header", async () => {
    const title = await screen.findByText(/Boutique Elegance/i);
    expect(title).toBeInTheDocument();
  });
  it("Must show 3 products with info", async () => {
    const cards = await screen.findAllByTestId("product-card");
    expect(cards.length).toBe(3);
    const productName = await screen.findByText(/Producto 3/i);
    expect(productName).toBeInTheDocument();
    const productPrice = await screen.findByText(/\$ 3.200.000/i);
    expect(productPrice).toBeInTheDocument();
    const quantities = await screen.findAllByText(/\+100/i);
    expect(quantities.length).toBe(1);
    const btnsPay = await screen.findAllByText(/Pay/i);
    expect(btnsPay.length).toBe(2);
    const btnsSold = await screen.findAllByText(/Sold/i);
    expect(btnsSold.length).toBe(1);
  });
  it("renders loading state", async () => {
    mockedUseSWR.mockReturnValue({
      data: [],
      isLoading: true,
      mutate: jest.fn(),
      error: undefined,
    });

    render(<ProductsPage />);
    const loading = await screen.findByTestId("loading");
    expect(loading).toBeInTheDocument();
  });

  it("renders empty state", async () => {
    mockedUseSWR.mockReturnValue({
      data: [],
      isLoading: false,
      mutate: jest.fn(),
      error: undefined,
    });

    render(<ProductsPage />);
    const emptyText = await screen.findByText(
      /No encontramos ningún producto/i,
    );
    expect(emptyText).toBeInTheDocument();
  });
  it("opens checkout modal when clicking Pay", async () => {
    const btns = await screen.findAllByText(/Pay/i);
    expect(btns.length).toBe(2);
    const btn = btns.at(0)!;
    fireEvent.click(btn);
    const titleModal = await screen.findByText(/Finalizar Compra/i);
    expect(titleModal).toBeInTheDocument();
  });
  it("opens checkout modal when clicking Pay", async () => {
    const btns = await screen.findAllByText(/Pay/i);
    expect(btns.length).toBe(2);
    const btn = btns.at(0)!;
    fireEvent.click(btn);
    const titleModal = await screen.findByText(/Finalizar Compra/i);
    expect(titleModal).toBeInTheDocument();
  });
  it("Should show message for recover buy", async () => {
    (useAppSelector as jest.Mock).mockImplementationOnce((selectorFn) =>
      selectorFn({
        info: {
          product: {
            idProduct: "1",
            name: "Producto",
            price: 200000,
            quantity: 1,
            image: "",
          } as Product,
          dataUser: { name: "Test User", email: "test@user.com" },
          address: "cra 11",
        },
      }),
    );

    render(<ProductsPage />);

    // Espera a que el título del modal aparezca
    const titleModal = await screen.findByText(/Continuar compra/i);
    expect(titleModal).toBeInTheDocument();
  });
});
