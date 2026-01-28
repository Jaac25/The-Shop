/**
 * @url /transactions
 * @method POST
 * @type Request
 */
export interface ITransactionBody {
  acceptance_token: string;
  amount_in_cents: number;
  currency: "COP" | "USD";
  customer_email: string;
  payment_method: {
    type?: string;
    phone_number?: number;
    token?: string;
    installments?: string;
  };
  payment_method_type?: string;
  payment_source_id?: number;
  redirect_url?: string;
  expiration_time?: string | null;
  customer_data?: {
    phone_number: string;
    full_name: string;
    legal_id: string;
    legal_id_type: string;
  };
  shipping_address?: {
    address_line_1: string;
    address_line_2: string;
    country: string;
    region: string;
    city: string;
    name: string;
    phone_number: string;
    postal_code: string;
  };
}

/**
 * @url /transactions
 * @method POST
 * @type Response
 */
export interface ITransactionWompi {
  id: string;
  created_at: string;
  finalized_at?: string;
  amount_in_cents: number;
  reference: string;
  customer_email: string;
  currency: string;
  payment_method_type: string;
  payment_method: {
    type: "PSE" | "CARD";
    extra: {
      async_payment_url?: string;
      ticket_id?: string;
      is_three_ds?: boolean;
      return_code?: string;
      request_date?: string;
    };
    phone_number: string;
  };
  status: TRANSACTION_STATUS;
  status_message?: string;
  billing_data: null;
  shipping_address: null;
  redirect_url?: string;
  payment_source_id: null;
  payment_link_id: null;
  customer_data: null;
  bill_id: null;
  taxes: [];
  tip_in_cents: null;
  traceability_code?: string;
  transaction_cycle?: string;
  transaction_state?: string;
  three_ds_auth_type?: null;
  external_identifier?: string;
  bank_processing_date?: string;
  user_type?: number;
  user_legal_id?: string;
  user_legal_id_type?: string;
  payment_description?: string;
  financial_institution_code?: string;
  merchant: {
    id: number;
    name: string;
    legal_name: string;
    contact_name: string;
    phone_number: string;
    logo_url?: string;
    legal_id_type: string;
    email: string;
    legal_id: string;
    public_key: string;
  };
}

export type TRANSACTION_STATUS =
  | "APPROVED"
  | "PENDING"
  | "DECLINED"
  | "VOIDED"
  | "ERROR";
