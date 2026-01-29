/**
 * @url /products
 * @method GET
 * @type Response
 */
export interface Product {
  idProduct: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}
