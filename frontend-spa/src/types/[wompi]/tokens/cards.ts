/**
 * @url [WOMPI_ENVIRONMENT]/tokens/cards
 * @method POST
 * @type Response
 */
export interface ICardResponse {
  status?: "CREATED";
  data: {
    id: string;
    created_at: string;
    brand: string;
    name: string;
    last_four: string;
    bin: string;
    exp_year: string;
    exp_month: string;
    card_holder: string;
    created_with_cvc: boolean;
    expires_at: string;
    validity_ends_at: string;
  };
}

/**
 * @url WOMPI_ENVIRONMENT/token/cards
 * @method POST
 * @type Request
 */
export interface ICardBody {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
  card_holder: string;
  alias?: string;
}
