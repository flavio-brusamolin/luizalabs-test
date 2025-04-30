import { AddProductCache, GetProductCache, UpdateProductCache, RemoveProductCache } from '../../app/contracts/cache';
import { Product, ProductId } from '../../domain/entities/product';

export class ProductCache implements AddProductCache, GetProductCache, UpdateProductCache, RemoveProductCache {
  constructor(private readonly staleTime: number) {}

  private static products = new Map<ProductId, { data: Product; staleTimer?: NodeJS.Timeout }>();

  async addProduct(product: Product): Promise<void> {
    this.setProduct(product);
  }

  async updateProduct(product: Product): Promise<void> {
    this.setProduct(product);
  }

  async getProduct(productId: ProductId): Promise<Product> {
    const product = ProductCache.products.get(productId);
    return product?.data;
  }

  async removeProduct(productId: ProductId): Promise<void> {
    ProductCache.products.delete(productId);
  }

  private setProduct(product: Product): void {
    this.clearStaleTimer(product.productId);

    const staleTimer = setTimeout(() => {
      this.markAsStale(product.productId);
    }, this.staleTime);

    ProductCache.products.set(product.productId, {
      data: product,
      staleTimer,
    });
  }

  private markAsStale(productId: ProductId): void {
    const product = ProductCache.products.get(productId);
    if (product) {
      product.data.markAsStale();
      this.clearStaleTimer(productId);
    }
  }

  private clearStaleTimer(productId: ProductId): void {
    const product = ProductCache.products.get(productId);
    if (product?.staleTimer) {
      clearTimeout(product.staleTimer);
    }
  }
}
