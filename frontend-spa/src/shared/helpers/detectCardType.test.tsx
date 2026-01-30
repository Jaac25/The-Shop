import { detectCardType, getCardTypeIcon } from "./detectCardType";

describe("detectCardType", () => {
  test("detecta Visa correctamente", () => {
    expect(detectCardType("4111 1111 1111 1111")).toBe("Visa");
  });

  test("detecta Mastercard correctamente", () => {
    expect(detectCardType("5500 0000 0000 0004")).toBe("Mastercard");
    expect(detectCardType("2221 0000 0000 0009")).toBe("Mastercard"); // Mastercard 2-series
  });

  test("detecta American Express correctamente", () => {
    expect(detectCardType("3400 0000 0000 009")).toBe("American Express");
  });

  test("detecta Discover correctamente", () => {
    expect(detectCardType("6011 0000 0000 0004")).toBe("Discover");
  });

  test("detecta Diners Club correctamente", () => {
    expect(detectCardType("3000 0000 0000 04")).toBe("Diners Club");
  });

  test("retorna vacío si no coincide", () => {
    expect(detectCardType("1234 5678 9012 3456")).toBe("");
  });
});

describe("getCardTypeIcon", () => {
  test("retorna el icono correcto de Visa", () => {
    expect(getCardTypeIcon("Visa")).toBe(
      "https://img.icons8.com/color/96/000000/visa.png",
    );
  });

  test("retorna vacío si no existe el tipo", () => {
    expect(getCardTypeIcon("Master")).toBe("");
  });
});
