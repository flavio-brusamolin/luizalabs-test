import { Customer, CustomerId } from '../entities/customer';
import { UseCase } from './use-case';

export type GetCustomerUseCase = UseCase<CustomerId, Customer>;
