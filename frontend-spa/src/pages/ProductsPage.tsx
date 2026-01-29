"use client";

import { useState } from "react";

import useSWR from "swr";
import { fetcher } from "../app/providers";
import { CheckoutModal } from "../components/CheckoutModal";
import { Loading } from "../components/Loading";
import { ProductCard } from "../components/ProductCard";
import { TransactionSummary } from "../components/TransactionSummary";
import type { Product } from "../types/product";
import type { TransactionResume } from "../types/transactions";

export const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [transaction, setTransaction] = useState<TransactionResume | null>(
    null,
  );

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
  };

  const handlePaymentSuccess = (transactionData: TransactionResume) => {
    setSelectedProduct(null);
    setTransaction(transactionData);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleCloseSummary = () => {
    setTransaction(null);
  };

  const { data: products = [], isLoading: isLoading } = useSWR<Product[]>(
    {
      url: "/products",
    },
    fetcher,
  );

  let children = null;
  if (isLoading)
    children = (
      <main className="container max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 15 }).map((_, id) => (
          <div key={id} className="animate-pulse">
            <div className="bg-card rounded-2xl shadow overflow-hidden transition-all duration-300 group">
              <div className="aspect-square overflow-hidden w-full h-60 bg-gray-200"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 justify-between">
                  <span className="font-display text-2xl font-semibold text-primary h-14 bg-gray-200 w-full rounded"></span>
                  <span className="w-36 rounded h-14 bg-gray-200"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    );
  else if (!products.length)
    children = (
      <div className="w-full h-full flex flex-col justify-center items-center">
        Estamos buscando los productos
        <Loading color="green" />
      </div>
    );
  else
    children = (
      <main className="container max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <div
            key={product.idProduct}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} onBuy={handleBuy} />
          </div>
        ))}
      </main>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-8 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center">
            Boutique Elegance
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Productos premium seleccionados para ti
          </p>
        </div>
      </header>

      {/* Products Grid */}
      {children}

      {selectedProduct && (
        <CheckoutModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {transaction && (
        <TransactionSummary
          transaction={transaction}
          onClose={handleCloseSummary}
        />
      )}
    </div>
  );
};
