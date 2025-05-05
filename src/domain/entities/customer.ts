import { RequiredParameterError } from '../errors';
import { ProductId } from './product';

export type CustomerId = string;
export type ApiKey = string;

export interface CustomerInput {
  customerId?: CustomerId;
  name: string;
  email: string;
  favorites?: ProductId[];
  apiKey?: ApiKey;
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
  favorites: ProductId[];
  apiKey: ApiKey;

  constructor({ customerId, name, email, favorites, apiKey }: CustomerInput) {
    this.setCustomerId(customerId);
    this.setName(name);
    this.setEmail(email);
    this.setFavorites(favorites);
    this.setApiKey(apiKey);
  }

  private setCustomerId(customerId?: CustomerId): void {
    this.customerId = customerId ?? crypto.randomUUID();
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

  private setFavorites(favorites?: ProductId[]): void {
    this.favorites = favorites ?? [];
  }

  private setApiKey(apiKey?: ApiKey): void {
    this.apiKey = apiKey ?? crypto.randomUUID();
  }

  serialize(): SerializedCustomer {
    return {
      customerId: this.customerId,
      name: this.name,
      email: this.email,
    };
  }
}
