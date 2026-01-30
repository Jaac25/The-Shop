import clsx from "clsx";
import { useFormatValue } from "../core/hooks/useFormatValue";
import type { Product } from "../types/product";
import { Button } from "./ui/Button";

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

export const ProductCard = ({ product, onBuy }: ProductCardProps) => {
  const { formatValue } = useFormatValue();

  const sold = product.quantity === 0;
  return (
    <div
      data-testid="product-card"
      className=" h-full bg-card rounded-2xl shadow overflow-hidden transition-all duration-300 group"
    >
      <div className="aspect-square overflow-hidden">
        {product?.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-6">
        <p className="font-display text-xl font-medium text-foreground mb-2 flex items-center gap-3">
          {product.name}
          <span
            title={`Cantidad: ${product.quantity}`}
            aria-label={`Cantidad ${product.quantity}`}
            className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm font-semibold shadow select-none ${
              product.quantity === 0
                ? "bg-red-100 text-red-700"
                : product.quantity < 10
                  ? "bg-amber-100 text-amber-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                product.quantity === 0
                  ? "bg-red-600"
                  : product.quantity < 10
                    ? "bg-amber-600"
                    : "bg-green-600"
              }`}
              aria-hidden
            />
            <span>{product.quantity > 100 ? "+100" : product.quantity}</span>
          </span>
        </p>
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl font-semibold text-primary">
            {formatValue(product.price)}
          </span>
          <Button
            className={clsx(
              "w-36 h-14 font-semibold",
              sold &&
                "bg-red-500 text-black cursor-default! scale-100! hover:opacity-100",
            )}
            disabled={sold}
            onClick={() => onBuy(product)}
          >
            {sold ? "Sold" : "Pay with credit card"}
          </Button>
        </div>
      </div>
    </div>
  );
};
