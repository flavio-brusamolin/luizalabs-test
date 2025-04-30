import { RequiredParameterError } from '../errors/required-parameter-error';
import { ProductId } from './product';

export type CustomerId = string;

export interface CustomerInput {
  name: string;
  email: string;
}

export interface SerializedCustomer {
  customerId: CustomerId;
  name: string;
  email: string;
}

export class Customer {
  customerId: CustomerId;
  name: string;
  email: string;
  favorites: Array<ProductId> = [];
  apiKey: string;

  constructor({ name, email }: CustomerInput) {
    this.setName(name);
    this.setEmail(email);
    this.setCustomerId();
    this.setApiKey();
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

  private setCustomerId(): void {
    this.customerId = crypto.randomUUID();
  }

  private setApiKey(): void {
    this.apiKey = crypto.randomUUID();
  }

  serialize(): SerializedCustomer {
    return {
      customerId: this.customerId,
      name: this.name,
      email: this.email,
    };
  }
}
