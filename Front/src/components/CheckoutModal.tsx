import { useFormatValue } from "@/core/hooks/useFormatValue";
import { ICardBody, ICardResponse } from "@/types/[wompi]/tokens/cards";
import { Product } from "@/types/product";
import { requestShop } from "@/utils/requests";
import { AxiosError } from "axios";
import { Lock, X } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { WOMPI_ENVIRONMENT, WOMPI_PUBLIC_KEY } from "../../keys";
import { ErrorAlert } from "./CustomAlert";
import { Button } from "./form/Button";
import { Input } from "./form/Input";

export interface TransactionData {
  product: Product;
  cardLast4: string;
  cardHolder: string;
  transactionId: string;
  date: string;
}

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (transactionData: TransactionData) => void;
}

interface FormValues {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvc: string;
}

export const CheckoutModal = ({
  product,
  onClose,
  onSuccess,
}: CheckoutModalProps) => {
  const { formatValue } = useFormatValue();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const cardNumber = watch("cardNumber");
  const expiryDate = watch("expiryDate");
  const cvc = watch("cvc");

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ").substring(0, 19) : "";
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${
        parseInt(cleaned.substring(0, 2)) > 12 ? 12 : cleaned.substring(0, 2)
      }/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const tokenizeCard = async (body: ICardBody) => {
    const { data } = await requestShop.post<ICardResponse>(
      `${WOMPI_ENVIRONMENT}/tokens/cards`,
      body,
      {
        headers: {
          Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
        },
      },
    );
    return data?.data;
  };

  const createTransaction = async ({
    token,
    customerEmail,
    idProduct,
  }: {
    customerEmail: string;
    idProduct: string;
  }) => {
    const { data } = await requestShop.post<ICardResponse>(
      `/transactions`,
      { token, customerEmail, idProduct },
      {
        headers: {
          Authorization: `Bearer ${WOMPI_PUBLIC_KEY}`,
        },
      },
    );
    return data?.data;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const cardTokenized = await tokenizeCard({
        card_holder: data.cardHolder,
        cvc: data.cvc,
        exp_month: data.expiryDate.substring(0, 2) ?? "",
        exp_year: data.expiryDate.substring(3, 5) ?? "",
        number: data.cardNumber.replaceAll(" ", ""),
      });

      const transactionData: TransactionData = {
        product,
        cardLast4: data.cardNumber.replace(/\s/g, "").slice(-4),
        cardHolder: data.cardHolder,
        transactionId: `TXN-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`,
        date: new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      onSuccess(transactionData);
    } catch (e) {
      const error = e as AxiosError;
      console.log({ error });
      ErrorAlert(`${error.message}`);
    }
  };

  return (
    <div
      className="modal-overlay flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-content w-full max-w-md animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Finalizar Compra
          </h2>
          <Button onClick={onClose} className="p-2 rounded-full">
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-secondary rounded-xl mb-6">
          {!!product.image && (
            <Image
              src={product.image}
              alt={product.name}
              width={1000}
              height={1000}
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{product.name}</h3>
            <p className="text-primary font-display text-lg font-semibold">
              {formatValue(product.price)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Número de Tarjeta"
            placeholder="1234 5678 9012 3456"
            className="pl-12"
            value={cardNumber}
            {...register("cardNumber", {
              required: true,
              onChange: (e) =>
                setValue("cardNumber", formatCardNumber(e.target.value)),
            })}
            maxLength={19}
          />

          <Input
            label="Nombre del Titular"
            placeholder="Juan Pérez"
            {...register("cardHolder", { required: true })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Expiración"
              placeholder="MM/AA"
              value={expiryDate}
              {...register("expiryDate", {
                required: true,
                onChange: (e) =>
                  setValue("expiryDate", formatExpiryDate(e.target.value)),
              })}
              maxLength={5}
            />

            <Input
              label="cvc"
              placeholder="123"
              value={cvc}
              {...register("cvc", {
                required: true,
                onChange: (e) =>
                  setValue(
                    "cvc",
                    e.target.value.replace(/\D/g, "").substring(0, 4),
                  ),
              })}
              maxLength={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center gap-2 py-4 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pagar {formatValue(product.price)}
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3" />
          Pago seguro encriptado
        </p>
      </div>
    </div>
  );
};
