export type ProductId = string;

interface ProductInput {
  productId: string;
  title: string;
  image: string;
  price: number;
  reviewScore?: number;
}

export class Product {
  productId: string;
  title: string;
  image: string;
  price: number;
  reviewScore?: number;
  stale: boolean;

  constructor(input: ProductInput) {
    this.productId = input.productId;
    this.title = input.title;
    this.image = input.image;
    this.price = input.price;
    this.reviewScore = input.reviewScore;
    this.stale = false;
  }

  markAsStale() {
    this.stale = true;
  }
}
