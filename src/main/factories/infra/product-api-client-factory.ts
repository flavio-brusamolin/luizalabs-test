import env from '../../config/env';
import { ProductApiClient } from '../../../infra/integration/product-api-client';

export const buildProductApiClient = (): ProductApiClient => {
  return new ProductApiClient(env.integrationConfig.productApiUrl);
};
