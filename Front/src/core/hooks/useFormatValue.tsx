export const useFormatValue = () => {
  const convention = "es-CO";

  const formatValue = (val?: string | number) => {
    const value = val ? val : 0;
    if (Number.isNaN(Number.parseFloat(value.toString()))) return value;
    const valueAsNumber =
      typeof value === "string" ? Number.parseFloat(value) || 0 : value;
    const formattedValue = new Intl.NumberFormat(convention, {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valueAsNumber);
    return formattedValue;
  };

  return { formatValue };
};
