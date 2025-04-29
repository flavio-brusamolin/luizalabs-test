import { Customer, CustomerInput } from '../entities/customer';
import { UseCase } from './use-case';

export type AddCustomerInput = CustomerInput;
export type AddCustomerUseCase = UseCase<AddCustomerInput, Customer>;
