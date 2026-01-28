/**
 * @url /merchants/:publicKey
 * @method GET
 * @type Response
 */
export interface IMerchantResponse {
  id: number;
  name: string;
  email: string;
  contact_name: string;
  phone_number: string;
  active: boolean;
  logo_url: string | null;
  legal_name: string;
  legal_id_type: string;
  legal_id: string;
  public_key: string;
  accepted_currencies: string[];
  fraud_javascript_key: null;
  fraud_groups: [];
  accepted_payment_methods: string[];
  payment_methods: IPaymentMethod[];
  presigned_acceptance: {
    acceptance_token: string;
    permalink: string;
    type: string;
  };
}

interface IPaymentMethod {
  name: string;
  payment_processors: IPaymentProcessor[];
}

interface IPaymentProcessor {
  name: string;
}
