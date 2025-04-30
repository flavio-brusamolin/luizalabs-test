import { Customer } from '../../../domain/entities/customer';

export interface PublishCreatedCustomerQueue {
  publishCreatedCustomer: (customer: Customer) => void;
}
