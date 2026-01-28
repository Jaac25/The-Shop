import { Product } from "@/types/product";
import { useFormatValue } from "@/core/hooks/useFormatValue";
import Image from "next/image";
import { Button } from "./form/Button";

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

export const ProductCard = ({ product, onBuy }: ProductCardProps) => {
  const { formatValue } = useFormatValue();

  return (
    <div className="bg-card rounded-2xl shadow overflow-hidden transition-all duration-300 group">
      <div className="aspect-square overflow-hidden">
        {product?.image && (
          <Image
            width={1000}
            height={1000}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-medium text-foreground mb-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl font-semibold text-primary">
            {formatValue(product.price)}
          </span>
          <Button
            className="w-36 h-14 font-semibold"
            onClick={() => onBuy(product)}
          >
            Pay with credit card
          </Button>
        </div>
      </div>
    </div>
  );
};
