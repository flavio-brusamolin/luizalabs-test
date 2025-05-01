import { Customer, CustomerId } from '../entities/customer';
import { AddCustomerInput } from './add-customer';
import { UseCase } from './use-case';

export type CustomerProps = Partial<AddCustomerInput>;
export type UpdateCustomerInput = CustomerProps & { customerId: CustomerId };
export type UpdateCustomerUseCase = UseCase<UpdateCustomerInput, Customer>;
