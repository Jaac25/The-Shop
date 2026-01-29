import { CheckCircle, Clock, type LucideIcon, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR, { type KeyedMutator } from "swr";
import { fetcher } from "../app/providers";
import { useFormatValue } from "../core/hooks/useFormatValue";
import type { ITransaction, TransactionResume } from "../types/transactions";
import { Loading } from "./Loading";
import { Button } from "./ui/Button";
import type { Product } from "../types/product";
import dayjs from "dayjs";

interface TransactionSummaryProps {
  transaction: TransactionResume;
  onClose: () => void;
  mutate: KeyedMutator<Product[]>;
}

interface StatusConfig {
  icon: LucideIcon;
  bgColor: string;
  iconColor: string;
  title: string;
  description: string;
  buttonText: string;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  APPROVED: {
    icon: CheckCircle,
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
    title: "¡Pago Exitoso!",
    description: "Tu compra ha sido procesada correctamente",
    buttonText: "Continuar Comprando",
  },
  PENDING: {
    icon: Clock,
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Pago Pendiente",
    description: "Tu pago está en proceso. No cierres esta ventana.",
    buttonText: "Esperando confirmación...",
  },
  DECLINED: {
    icon: XCircle,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    title: "Pago Anulado",
    description: "Tu pago no fue procesado.",
    buttonText: "Volver",
  },
  ERROR: {
    icon: XCircle,
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    title: "Error en la Transacción",
    description: "Ocurrió un error procesando tu pago.",
    buttonText: "Volver",
  },
};

const TransactionDetails = ({
  transaction,
  formatValue,
}: {
  transaction: TransactionResume;
  formatValue: (val?: string | number | undefined) => string | number;
}) => (
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
          {formatValue(transaction.product.price)}
        </p>
      </div>
    </div>

    <div className="space-y-3">
      <DetailRow
        label="ID de Transacción"
        value={transaction.idTransactionWompi}
        mono
      />
      <DetailRow label="Titular" value={transaction.name} />
      <DetailRow label="Tarjeta" value={`•••• ${transaction.cardLast4}`} />
      <DetailRow
        label="Fecha"
        value={dayjs(transaction.finalizedAt || transaction.createdAt).format(
          "DD-MM-YYYY HH:mm",
        )}
      />
    </div>
  </div>
);

const DetailRow = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={`text-foreground ${mono ? "font-mono text-sm" : ""}`}>
      {value}
    </span>
  </div>
);

export const TransactionSummary = ({
  transaction,
  mutate,
  onClose,
}: TransactionSummaryProps) => {
  const { formatValue } = useFormatValue();
  const [state, setState] = useState<ITransaction["status"]>(
    transaction.status,
  );

  const { data: newTransaction, isLoading } = useSWR<ITransaction>(
    state === "PENDING" &&
      transaction.product.idProduct &&
      transaction.idTransactionWompi && {
        url: `/transactions`,
        params: {
          id: transaction.idTransactionWompi,
          idProduct: transaction.product.idProduct,
        },
      },
    fetcher,
    { refreshInterval: 4000 },
  );

  useEffect(() => {
    if (
      newTransaction?.status &&
      state !== newTransaction.status &&
      newTransaction.status !== "PENDING"
    ) {
      const timer = setTimeout(() => {
        if (newTransaction.status === "APPROVED") mutate();
        setState(newTransaction.status);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [newTransaction?.status, state, mutate]);

  if (isLoading) {
    return (
      <div
        className="modal-overlay flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="modal-content w-full max-w-md animate-scale-in text-center flex justify-center items-center h-96"
          onClick={(e) => e.stopPropagation()}
        >
          <Loading color="green" />
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[state || "ERROR"] || STATUS_CONFIG.ERROR;
  const Icon = config.icon;
  const isPending = state === "PENDING";

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
          <div
            className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center animate-scale-in`}
          >
            <Icon className={`w-10 h-10 ${config.iconColor}`} />
          </div>
        </div>

        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
          {config.title}
        </h2>
        <p className="text-muted-foreground mb-8">
          {config.description}{" "}
          {state !== "PENDING" && transaction.statusMessage}
        </p>

        <TransactionDetails
          transaction={transaction}
          formatValue={formatValue}
        />

        {isPending && (
          <div className="flex w-full justify-center items-center mb-4">
            <Loading color="green" />
          </div>
        )}

        <Button
          onClick={onClose}
          disabled={isPending}
          className="w-full disabled:opacity-50"
        >
          {config.buttonText}
        </Button>
      </div>
    </div>
  );
};
