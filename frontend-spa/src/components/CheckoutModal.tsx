import { AxiosError } from "axios";
import { Lock, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { request } from "../app/providers";
import { ENV } from "../config/env";
import { useFormatValue } from "../core/hooks/useFormatValue";
import { useAppDispatch, useAppSelector } from "../core/hooks/useRedux";
import { IInfo, setAddress, setUser } from "../features/info/infoSlice";
import {
  detectCardType,
  getCardTypeIcon,
} from "../shared/helpers/detectCardType";
import type { ICardBody, ICardResponse } from "../types/[wompi]/tokens/cards";
import type { Product } from "../types/product";
import type { ITransaction, TransactionResume } from "../types/transactions";
import { ErrorAlert } from "./CustomAlert";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

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
  const { dataUser, address } = useAppSelector((state) => state.info);
  const dispatch = useAppDispatch();
  const { formatValue } = useFormatValue();

  const {
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvc: "",
      name: dataUser?.name ?? "",
      email: dataUser?.email ?? "",
      address: address ?? "",
    },
  });

  const cardNumber = watch("cardNumber");

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
        token: infoToken?.id,
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

  const setStoreUser = (data: IInfo["dataUser"]) => {
    const { email, name } = data || {};
    dispatch(
      setUser({
        email: email ?? dataUser?.email,
        name: name ?? dataUser?.name,
      }),
    );
  };

  const setStoreAddress = (address: string) => dispatch(setAddress(address));

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
          <Button
            data-testid="btnClose"
            onClick={onClose}
            className="p-2 rounded-full"
          >
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
              <Controller
                name="cardNumber"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    label="Número de Tarjeta"
                    placeholder="1234 5678 9012 3456"
                    className="pl-12 w-full"
                    maxLength={19}
                    required
                    {...field}
                    onChange={(e) =>
                      field.onChange(formatCardNumber(e.target.value))
                    }
                  />
                )}
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

            <Controller
              name="cardHolder"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label="Nombre en la tarjeta"
                  placeholder="Juan Pérez"
                  required
                  {...field}
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="expiryDate"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    label="Fecha de Expiración"
                    placeholder="MM/AA"
                    maxLength={5}
                    required
                    {...field}
                    onChange={(e) =>
                      field.onChange(formatExpiryDate(e.target.value))
                    }
                  />
                )}
              />

              <Controller
                name="cvc"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    label="cvc"
                    placeholder="123"
                    maxLength={4}
                    required
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.replace(/\D/g, "").substring(0, 4),
                      )
                    }
                  />
                )}
              />
            </div>
          </div>
          <div className="space-y-4 shadow  p-4 rounded">
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label="Nombre del destinatario"
                  placeholder="Juan Ignacio Torres"
                  required
                  {...field}
                  onChange={(e) => {
                    setStoreUser({ name: e.target.value });
                    field.onChange(e);
                  }}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label="Email del destinatario"
                  placeholder="juanito@theshop.com"
                  required
                  {...field}
                  onChange={(e) => {
                    setStoreUser({ email: e.target.value });
                    field.onChange(e);
                  }}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  label="Dirección destino"
                  placeholder="cra 11 # 55"
                  required
                  {...field}
                  onChange={(e) => {
                    setStoreAddress(e.target.value);
                    field.onChange(e);
                  }}
                />
              )}
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
