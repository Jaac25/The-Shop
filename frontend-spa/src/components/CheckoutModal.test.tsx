jest.mock("../config/env", () => ({
  ENV: {
    HOST: "http://localhost:5173",
    WOMPI_ENVIRONMENT: "sandbox",
    WOMPI_PUBLIC_KEY: "fake_public_key",
  },
}));

jest.mock("../app/providers", () => ({
  request: { post: jest.fn() },
}));

jest.mock("../core/hooks/useRedux");

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CheckoutModal } from "./CheckoutModal";
import { request } from "../app/providers";
import * as Alerts from "./CustomAlert";
import { useAppDispatch, useAppSelector } from "../core/hooks/useRedux";
import { act } from "react";

jest.spyOn(Alerts, "ErrorAlert").mockImplementation(jest.fn());
const mockDispatch = jest.fn();

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

describe("Validation checkout modal", () => {
  jest.clearAllMocks();
  const onClose = jest.fn();
  beforeEach(() => {
    (useAppSelector as jest.Mock).mockImplementation((selectorFn) =>
      selectorFn({
        info: {
          dataUser: { name: "Test User", email: "test@user.com" },
          address: "cra 11",
        },
      }),
    );
  });
  (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  it("Must allow change the info in checkout modal and show summary modal", async () => {
    render(
      <CheckoutModal
        onClose={onClose}
        onSuccess={() => {}}
        product={products.at(0)!}
      />,
    );
    const titleModal = await screen.findByText(/Finalizar Compra/i);
    expect(titleModal).toBeInTheDocument();
    const prices = await screen.findAllByText(/\$ 125.000/i);
    expect(prices.length).toBe(2);

    const numberCardInput = await screen.findByPlaceholderText(
      "1234 5678 9012 3456",
    );
    expect(numberCardInput).toBeInTheDocument();
    fireEvent.change(numberCardInput, { target: { value: 4242424242424242 } });
    const cardType = await screen.findByText(/visa/i);
    expect(cardType).toBeInTheDocument();

    const nameCardInput = await screen.findByPlaceholderText("Juan Pérez");
    expect(nameCardInput).toBeInTheDocument();
    fireEvent.change(nameCardInput, { target: { value: "Jorge" } });

    const dateInput = await screen.findByPlaceholderText("MM/AA");
    expect(dateInput).toBeInTheDocument();
    fireEvent.change(dateInput, { target: { value: "08/28" } });

    const cvvInput = await screen.findByPlaceholderText("123");
    expect(cvvInput).toBeInTheDocument();
    fireEvent.change(cvvInput, { target: { value: "08/28" } });

    const nameInput = await screen.findByPlaceholderText("Juan Ignacio Torres");
    expect(nameInput).toBeInTheDocument();
    fireEvent.change(nameInput, { target: { value: "Jorge Acevedo" } });

    const emailInput = await screen.findByPlaceholderText(
      "juanito@theshop.com",
    );
    expect(emailInput).toBeInTheDocument();
    fireEvent.change(emailInput, { target: { value: "a@a.com" } });

    const btn = await screen.findByText(/Pagar/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
  });
  it("calls onSuccess when payment flow succeeds", async () => {
    const onSuccess = jest.fn();

    (request.post as jest.Mock)
      .mockResolvedValueOnce({ data: { id: "12" } }) // createOrder
      .mockResolvedValueOnce({ data: { data: { id: "token123" } } }) //TokenizeCard
      .mockResolvedValueOnce({
        data: { idTransaction: "txn123", status: "success" },
      }); // createTransaction

    render(
      <CheckoutModal
        product={products[0]}
        onClose={() => {}}
        onSuccess={onSuccess}
      />,
    );

    fireEvent.change(
      await screen.findByPlaceholderText("1234 5678 9012 3456"),
      {
        target: { value: "4242424242424242" },
      },
    );
    fireEvent.change(await screen.findByPlaceholderText("Juan Pérez"), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(await screen.findByPlaceholderText("MM/AA"), {
      target: { value: "12/28" },
    });
    fireEvent.change(await screen.findByPlaceholderText("123"), {
      target: { value: "123" },
    });
    fireEvent.change(
      await screen.findByPlaceholderText("Juan Ignacio Torres"),
      {
        target: { value: "Juan Torres" },
      },
    );
    fireEvent.change(
      await screen.findByPlaceholderText("juanito@theshop.com"),
      {
        target: { value: "juan@correo.com" },
      },
    );
    fireEvent.change(await screen.findByPlaceholderText("cra 11 # 55"), {
      target: { value: "Cra 11" },
    });

    const btn = await screen.findByText(/Pagar/i);

    await act(async () => {
      fireEvent.click(btn);
    });
    await screen.findByText(/Pago seguro encriptado/i);

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());

    expect(onSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        idTransaction: "txn123",
        product: products[0],
        name: "Juan Torres",
        cardLast4: "4242",
        address: "Cra 11",
      }),
    );
  });

  it("closes the modal when clicking on overlay or X button", async () => {
    render(
      <CheckoutModal
        onClose={onClose}
        onSuccess={() => {}}
        product={products.at(0)!}
      />,
    );
    const titleModal = await screen.findByText(/Finalizar Compra/i);
    expect(titleModal).toBeInTheDocument();
    const closeButton = await screen.findAllByRole("button");
    expect(closeButton.length).toBe(2);
    fireEvent.click(closeButton.at(0)!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it("formats card number and expiry date", async () => {
    render(
      <CheckoutModal
        onClose={onClose}
        onSuccess={() => {}}
        product={products.at(0)!}
      />,
    );
    const cardInput = await screen.findByPlaceholderText("1234 5678 9012 3456");
    expect(cardInput).toBeInTheDocument();
    fireEvent.change(cardInput, { target: { value: "4242424242424242" } });
    expect(cardInput).toHaveValue("4242 4242 4242 4242");

    const expiryInput = await screen.findByPlaceholderText("MM/AA");
    expect(expiryInput).toBeInTheDocument();
    fireEvent.change(expiryInput, { target: { value: "1228" } });
    expect(expiryInput).toHaveValue("12/28");
  });
  it("shows error alert when tokenizeCard fails", async () => {
    (request.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          error: {
            messages: {
              number: { messages: { invalid: "Invalid card" } },
            },
          },
        },
      },
    });

    render(
      <CheckoutModal
        product={products[0]}
        onClose={() => {}}
        onSuccess={() => {}}
      />,
    );

    const btn = await screen.findByText(/Pagar/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(Alerts.ErrorAlert).toHaveBeenCalled();
  });
});
