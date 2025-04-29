import { AddProductCache, GetProductCache, UpdateProductCache, RemoveProductCache } from '../../app/contracts/cache';
import { Product, ProductId } from '../../domain/entities/product';

export class ProductCache implements AddProductCache, GetProductCache, UpdateProductCache, RemoveProductCache {
  private static products = new Map<ProductId, { data: Product; staleTimer?: NodeJS.Timeout }>();

  async addProduct(product: Product, staleTime: number): Promise<void> {
    this.setProduct(product, staleTime);
    return Promise.resolve();
  }

  async updateProduct(product: Product, staleTime: number): Promise<void> {
    this.setProduct(product, staleTime);
    return Promise.resolve();
  }

  async getProduct(productId: ProductId): Promise<Product> {
    const product = ProductCache.products.get(productId);
    return Promise.resolve(product?.data);
  }

  async removeProduct(productId: ProductId): Promise<void> {
    ProductCache.products.delete(productId);
    return Promise.resolve();
  }

  private setProduct(product: Product, staleTime: number): void {
    this.clearStaleTimer(product.productId);

    const staleTimer = setTimeout(() => {
      this.markAsStale(product.productId);
    }, staleTime);

    ProductCache.products.set(product.productId, {
      data: { ...product, stale: false },
      staleTimer,
    });
  }

  private markAsStale(productId: ProductId): void {
    const product = ProductCache.products.get(productId);
    if (product) {
      ProductCache.products.set(productId, {
        data: { ...product.data, stale: true },
      });

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
