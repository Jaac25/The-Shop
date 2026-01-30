import { useState } from "react";

import useSWR from "swr";
import { fetcher } from "../app/providers";
import { CheckoutModal } from "../components/CheckoutModal";
import { Loading } from "../components/Loading";
import { ProductCard } from "../components/ProductCard";
import { TransactionSummary } from "../components/TransactionSummary";
import type { Product } from "../types/product";
import type { TransactionResume } from "../types/transactions";
import { motion, AnimatePresence } from "framer-motion";

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

  const {
    data: products = [],
    isLoading,
    mutate,
  } = useSWR<Product[]>(
    {
      url: "/products",
    },
    fetcher,
  );

  let children = null;
  if (isLoading)
    children = (
      <main
        data-testid="loading"
        className="container max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
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
        No encontramos ningún producto
        <Loading color="green" />
      </div>
    );
  else
    children = (
      <main className="container max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.idProduct}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <ProductCard
                key={product.idProduct}
                product={product}
                onBuy={handleBuy}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </main>
    );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-linear-to-t z-50 from-green-100 backdrop-blur-md to-transparent py-8 ">
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
          mutate={mutate}
          onClose={handleCloseSummary}
        />
      )}
    </div>
  );
};
