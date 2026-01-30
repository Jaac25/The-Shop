import { render, screen } from "@testing-library/react";
import { TransactionSummary } from "./TransactionSummary";
import { TransactionResume } from "../types/transactions";

jest.mock("../config/env", () => ({
  ENV: {
    HOST: "http://localhost:5173",
    WOMPI_ENVIRONMENT: "sandbox",
    WOMPI_PUBLIC_KEY: "fake_public_key",
  },
}));

const transaction: TransactionResume = {
  idTransactionWompi: "tx_123",
  status: "PENDING",
  product: {
    name: "Producto Test",
    price: 1000,
    idProduct: "1",
    quantity: 50,
    image: "",
  },
  cardLast4: "4242",
  name: "John Doe",
  address: "Fake Street",
  idTransaction: 1,
  idOrder: 1,
  createdAt: "",
  finalizedAt: "29-01-2026",
  amountInCents: 20000,
  reference: "",
  customerEmail: "a@a.com",
};

describe("Validation summary modal", () => {
  it("The transaction must be pending", async () => {
    render(
      <TransactionSummary
        onClose={() => {}}
        mutate={jest.fn()}
        transaction={transaction}
      />,
    );
    const text = await screen.findByText(/Tu pago está en proceso/i);
    expect(text).toBeInTheDocument();
  });
  it("The transaction must be approved", async () => {
    render(
      <TransactionSummary
        onClose={() => {}}
        mutate={jest.fn()}
        transaction={{ ...transaction, status: "APPROVED" }}
      />,
    );
    const text = await screen.findByText(
      /Tu compra ha sido procesada correctamente/i,
    );
    expect(text).toBeInTheDocument();
    const id = await screen.findByText(transaction.idTransactionWompi);
    expect(id).toBeInTheDocument();
    const name = await screen.findByText(transaction.name);
    expect(name).toBeInTheDocument();
    const numb = await screen.findByText(`•••• ${transaction.cardLast4}`);
    expect(numb).toBeInTheDocument();
  });
  it("The transaction must be declined", async () => {
    render(
      <TransactionSummary
        onClose={() => {}}
        mutate={jest.fn()}
        transaction={{ ...transaction, status: "DECLINED" }}
      />,
    );
    const text = await screen.findByText(/Tu pago no fue procesado/i);
    expect(text).toBeInTheDocument();
  });
});
