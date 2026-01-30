import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ProductsPage } from "./ProductsPage";
import useSWR from "swr";

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

// jest.mock("swr", () => ({
//   __esModule: true,
//   default: (key: { url?: string }) => {
//     if (key && key.url === "/products") {
//       return {
//         data: products,
//         isLoading: false,
//         error: undefined,
//       };
//     }
//     return { data: undefined, isLoading: false, error: undefined };
//   },
// }));

jest.mock("swr");

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
    mockedUseSWR.mockReturnValue({
      data: products,
      isLoading: false,
      mutate: jest.fn(),
      error: undefined,
    });
    render(<ProductsPage />);
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
});
