import { Customer } from '../entities/customer';
import { UseCase } from './use-case';

export type AddCustomerInput = {
  name: string;
  email: string;
};

export type AddCustomerUseCase = UseCase<AddCustomerInput, Customer>;
