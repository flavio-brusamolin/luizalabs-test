import { CustomerId } from '../../domain/entities/customer';

declare module 'express-serve-static-core' {
  interface Request {
    customerId?: CustomerId;
  }
}
