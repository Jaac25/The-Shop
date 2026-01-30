import { fireEvent, render, screen } from "@testing-library/react";
import { CheckoutModal } from "./CheckoutModal";
import { request } from "../app/providers";
import * as Alerts from "./CustomAlert";

jest.spyOn(Alerts, "ErrorAlert").mockImplementation(jest.fn());

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
  const onClose = jest.fn();

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

    const addressInput = await screen.findByPlaceholderText("cra 11 # 55");
    expect(addressInput).toBeInTheDocument();
    fireEvent.change(addressInput, { target: { value: "cra 11" } });
    expect(addressInput).toHaveValue("cra 11");

    const btn = await screen.findByText(/Pagar/i);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
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
