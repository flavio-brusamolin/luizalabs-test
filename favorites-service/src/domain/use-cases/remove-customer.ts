import { CustomerId } from '../entities/customer';
import { UseCase } from './use-case';

export type RemoveCustomerUseCase = UseCase<CustomerId, void>;
