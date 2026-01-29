import { AxiosError } from "axios";
import { Lock, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { request } from "../app/providers";
import { ENV } from "../config/env";
import { useFormatValue } from "../core/hooks/useFormatValue";
import type { ICardBody, ICardResponse } from "../types/[wompi]/tokens/cards";
import type { Product } from "../types/product";
import type { ITransaction, TransactionResume } from "../types/transactions";
import { ErrorAlert } from "./CustomAlert";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  detectCardType,
  getCardTypeIcon,
} from "../shared/helpers/detectCardType";

interface CheckoutModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: (transactionData: TransactionResume) => void;
}

interface FormValues {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvc: string;
  name: string;
  email: string;
  address: string;
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
      name: "",
      email: "",
      address: "",
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
    try {
      const { data } = await request.post<ICardResponse>(
        `${ENV.WOMPI_ENVIRONMENT}/tokens/cards`,
        body,
        {
          headers: {
            Authorization: `Bearer ${ENV.WOMPI_PUBLIC_KEY}`,
          },
        },
      );
      return data?.data;
    } catch (e) {
      const error = e as AxiosError<{
        error: {
          messages?: Record<
            string,
            { messages?: Record<string, string | string[]> | string[] }
          >;
        };
      }>;
      const errors = Object.entries(
        error?.response?.data?.error?.messages ?? {},
      ).flatMap(([k, v]) => {
        if (Array.isArray(v)) return `${k}: ${v}`;
        return `${k} => ${Object.entries(v.messages ?? {})
          .map(
            ([key, value]) =>
              `${key}: ${typeof value === "string" ? value : value.join(", ")}`,
          )
          .join(", ")}`;
      });
      throw errors.length ? errors : e;
    }
  };

  const createTransaction = async ({
    token,
    idOrder,
    amountInCents,
    customerEmail,
  }: {
    token: string;
    customerEmail: string;
    idOrder: string;
    amountInCents: string;
  }) => {
    const { data } = await request.post<ITransaction>(
      `/transactions`,
      { token, customerEmail, idOrder, amountInCents },
      {
        headers: {
          Authorization: `Bearer ${ENV.WOMPI_PUBLIC_KEY}`,
        },
      },
    );
    return data;
  };

  const createOrder = async (body: {
    name: string;
    email: string;
    idProduct: string;
    address: string;
  }) => {
    const { data } = await request.post<{ id: string }>(`/orders`, body, {
      headers: {
        Authorization: `Bearer ${ENV.WOMPI_PUBLIC_KEY}`,
      },
    });
    return data;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const { id: idOrder } = await createOrder({
        email: data.email,
        idProduct: product.idProduct,
        name: data.name,
        address: data.address,
      });

      if (!idOrder) throw "Not was created the order";

      const infoToken = await tokenizeCard({
        card_holder: data.cardHolder,
        cvc: data.cvc,
        exp_month: data.expiryDate.substring(0, 2) ?? "",
        exp_year: data.expiryDate.substring(3, 5) ?? "",
        number: data.cardNumber.replaceAll(" ", ""),
      });

      const transaction = await createTransaction({
        token: infoToken.id,
        amountInCents: (product.price * 100).toString(),
        customerEmail: data.email,
        idOrder,
      });

      onSuccess({
        ...transaction,
        product,
        name: data.name,
        cardLast4: data.cardNumber.replace(/\s/g, "").slice(-4),
        address: data.address,
      });
    } catch (e) {
      const error = e as AxiosError<{ message: string }>;
      console.log({ error });
      ErrorAlert(`${error.response?.data.message ?? error.message ?? error}`);
    }
  };

  return (
    <div
      className="modal-overlay flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-content w-full max-w-md animate-scale-in overflow-y-auto h-[85%]"
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
            <img
              src={product.image}
              alt={product.name}
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4 shadow p-4 rounded">
            <div>
              <Input
                label="Número de Tarjeta"
                placeholder="1234 5678 9012 3456"
                className="pl-12 w-full"
                value={cardNumber}
                {...register("cardNumber", {
                  required: true,
                  onChange: (e) =>
                    setValue("cardNumber", formatCardNumber(e.target.value)),
                })}
                maxLength={19}
              />
              {detectCardType(cardNumber) && (
                <div className="flex items-center gap-2 h-min mt-2 justify-end">
                  <img
                    src={getCardTypeIcon(detectCardType(cardNumber))}
                    alt={detectCardType(cardNumber)}
                    className="h-6 w-auto"
                  />
                  <p className="text-xs text-muted-foreground">
                    {detectCardType(cardNumber)}
                  </p>
                </div>
              )}
            </div>

            <Input
              label="Nombre en la tarjeta"
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
          </div>
          <div className="space-y-4 shadow  p-4 rounded">
            <Input
              label="Nombre del destinatario"
              placeholder="Juan Ignacio Torres"
              {...register("name", { required: true })}
            />
            <Input
              label="Email del destinatario"
              placeholder="juanito@theshop.com"
              {...register("email", { required: true })}
            />
            <Input
              label="Dirección destino"
              placeholder="cra 11 # 55"
              {...register("address", { required: true })}
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
