export type ProductId = string;

export interface Product {
  productId: ProductId;
  title: string;
  image: string;
  price: number;
  reviewScore?: number;
  stale: boolean;
}
