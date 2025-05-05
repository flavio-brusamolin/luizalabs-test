import env from '../../config/env';
import { ProductCache } from '../../../infra/cache/product-cache';

export const buildProductCache = (): ProductCache => {
  return new ProductCache(env.cacheConfig.staleTime);
};
