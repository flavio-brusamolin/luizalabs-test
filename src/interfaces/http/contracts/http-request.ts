import { CustomerId } from '../../../domain/entities/customer';

export interface HttpRequest<Body = any, Headers = any, Params = any, Query = any> {
  body?: Body;
  headers?: Headers;
  params?: Params;
  query?: Query;
  customerId?: CustomerId;
}
