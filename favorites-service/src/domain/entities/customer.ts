import { RequiredParameterError } from '../errors/required-parameter-error';
import { ProductId } from './product';

export type CustomerId = string;

export interface CustomerInput {
  name: string;
  email: string;
}

export class Customer {
  customerId: CustomerId;
  name: string;
  email: string;
  favorites: Array<ProductId> = [];

  constructor({ name, email }: CustomerInput) {
    this.setCustomerId();
    this.setName(name);
    this.setEmail(email);
  }

  private setCustomerId(): void {
    this.customerId = crypto.randomUUID();
  }

  private setName(name: string): void {
    if (!name) {
      throw new RequiredParameterError('name');
    }
    this.name = name;
  }

  private setEmail(email: string): void {
    if (!email) {
      throw new RequiredParameterError('email');
    }
    this.email = email;
  }
}
