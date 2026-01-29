export const detectCardType = (number: string): string => {
    const cleaned = number.replace(/\D/g, "");

    // Visa
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned)) {
      return "Visa";
    }

    // Mastercard
    if (
      /^5[1-5][0-9]{14}$/.test(cleaned) ||
      /^2(?:22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[01][0-9]|720)[0-9]{12}$/.test(
        cleaned,
      )
    ) {
      return "Mastercard";
    }

    // American Express
    if (/^3[47][0-9]{13}$/.test(cleaned)) {
      return "American Express";
    }

    // Discover
    if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cleaned)) {
      return "Discover";
    }

    // Diners Club
    if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(cleaned)) {
      return "Diners Club";
    }

    return "";
  };

  
  export const getCardTypeIcon = (cardType: string): string => {
    const icons: Record<string, string> = {
      Visa: "https://img.icons8.com/color/96/000000/visa.png",
      Mastercard: "https://img.icons8.com/color/96/000000/mastercard.png",
      "American Express": "https://img.icons8.com/color/96/000000/amex.png",
      Discover: "https://img.icons8.com/color/96/000000/discover.png",
      "Diners Club": "https://img.icons8.com/color/96/000000/diners-club.png",
    };
    return icons?.[cardType] || "";
  };