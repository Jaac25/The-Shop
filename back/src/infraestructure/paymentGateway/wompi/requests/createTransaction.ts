import { v4 } from "uuid";
import { ITransactionBody, ITransactionWompi } from "../types/transactions";
import { IMetadata } from "../types/common";
import axios from "axios";
import { generateSHA256 } from "../../../../utils/encrypts";

export const createTransaction = async (
  body: ITransactionBody,
  idProduct: string,
) => {
  const reference = `${idProduct}_${v4()}`;
  const concatenatedText = `${reference}${body.amount_in_cents}${body.currency}${process.env.WOMPI_INTEGRITY_KEY}`;
  const hash = await generateSHA256(concatenatedText);

  const {
    data: { data },
  } = await axios.post<IMetadata<ITransactionWompi>>(
    `${process.env.WOMPI_ENVIRONMENT}/transactions`,
    {
      ...body,
      // publicKey: process.env.WOMPI_PUBLIC_KEY,
      signature: hash,
      reference,
    },
    { headers: { Authorization: `Bearer ${process.env.WOMPI_PUBLIC_KEY}` } },
  );
  return data;
};
