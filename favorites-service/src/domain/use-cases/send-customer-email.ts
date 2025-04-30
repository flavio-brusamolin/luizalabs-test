import { Customer } from '../entities/customer';
import { UseCase } from './use-case';

export type SendCustomerEmailInput = Customer;
export type SendCustomerEmailUseCase = UseCase<SendCustomerEmailInput, void>;
