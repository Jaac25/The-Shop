import axios from "axios";
import { IMetadata } from "../../../infraestructure/paymentGateway/wompi/types/common";
import { WOMPI_ENVIRONMENT, WOMPI_PUBLIC_KEY } from "../../../keys";
import { IMerchantResponse } from "../../../infraestructure/paymentGateway/wompi/types/merchants/[publicKey]";

export const getAcceptanceToken = async () => {
  const response = await axios.get<IMetadata<IMerchantResponse>>(
    `${WOMPI_ENVIRONMENT}/merchants/${WOMPI_PUBLIC_KEY}`,
  );
  return response?.data?.data.presigned_acceptance?.acceptance_token;
};
