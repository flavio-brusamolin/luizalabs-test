import * as axios from 'axios';
import { GetProductClient } from '../../app/contracts/integration';
import { ProductId, Product } from '../../domain/entities/product';

interface ProductResponse {
  id: string;
  title: string;
  price: number;
  image: string;
  brand: string;
  reviewScore?: number;
}

export class ProductApiClient implements GetProductClient {
  private readonly client: Axios.AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 3000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getProduct(productId: ProductId): Promise<Product> {
    const resource = `/products/${productId}`;

    try {
      const response = await this.client.get<ProductResponse>(resource);
      return this.mapToEntity(response.data);
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  private mapToEntity(productResponse: ProductResponse): Product {
    return {
      productId: productResponse.id,
      title: productResponse.title,
      image: productResponse.image,
      price: productResponse.price,
      reviewScore: productResponse.reviewScore,
      stale: false,
    };
  }
}
