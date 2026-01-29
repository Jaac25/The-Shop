import { CheckCircle, X } from "lucide-react";
import { Button } from "./form/Button";
import type { TransactionData } from "./CheckoutModal";

interface TransactionSummaryProps {
  transaction: TransactionData;
  onClose: () => void;
}

export const TransactionSummary = ({
  transaction,
  onClose,
}: TransactionSummaryProps) => {
  return (
    <div
      className="modal-overlay flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-content w-full max-w-md animate-scale-in text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </Button>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-scale-in">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          ¡Pago Exitoso!
        </h2>
        <p className="text-muted-foreground mb-8">
          Tu compra ha sido procesada correctamente
        </p>

        <div className="bg-secondary rounded-xl p-6 text-left space-y-4 mb-6">
          <div className="flex items-center gap-4 pb-4 border-b border-border">
            {!!transaction.product.image && (
              <img
                src={transaction.product.image}
                alt={transaction.product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div>
              <h3 className="font-medium text-foreground">
                {transaction.product.name}
              </h3>
              <p className="text-primary font-display text-lg font-semibold">
                ${transaction.product.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID de Transacción</span>
              <span className="font-mono text-sm text-foreground">
                {transaction.transactionId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Titular</span>
              <span className="text-foreground">{transaction.cardHolder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tarjeta</span>
              <span className="text-foreground">
                •••• {transaction.cardLast4}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fecha</span>
              <span className="text-foreground">{transaction.date}</span>
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          Continuar Comprando
        </Button>
      </div>
    </div>
  );
};
