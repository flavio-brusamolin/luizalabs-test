import {
  AddFavoriteRepository,
  CheckFavoriteRepository,
  GetFavoritesRepository,
  PurgeFavoriteRepository,
  RemoveFavoriteRepository,
  AddCustomerRepository,
  LoadCustomerByEmailRepository,
  LoadCustomerByApiKeyRepository,
  LoadCustomerByIdRepository,
} from '../../app/contracts/database';
import { ApiKey, Customer, CustomerId } from '../../domain/entities/customer';
import { ProductId } from '../../domain/entities/product';

export class CustomerRepository
  implements
    AddFavoriteRepository,
    CheckFavoriteRepository,
    GetFavoritesRepository,
    RemoveFavoriteRepository,
    PurgeFavoriteRepository,
    LoadCustomerByEmailRepository,
    AddCustomerRepository,
    LoadCustomerByApiKeyRepository,
    LoadCustomerByIdRepository
{
  private static customers: Customer[] = [];

  async addCustomer(customer: Customer): Promise<Customer> {
    CustomerRepository.customers.push(customer);
    return customer;
  }

  async loadCustomerById(customerId: CustomerId): Promise<Customer> {
    return CustomerRepository.customers.find((customer) => customer.customerId === customerId);
  }

  async loadCustomerByEmail(email: string): Promise<Customer> {
    return CustomerRepository.customers.find((customer) => customer.email === email);
  }

  async loadCustomerByApiKey(apiKey: ApiKey): Promise<Customer> {
    return CustomerRepository.customers.find((customer) => customer.apiKey === apiKey);
  }

  async addFavorite(customerId: CustomerId, productId: ProductId): Promise<void> {
    const customer = this.findCustomer(customerId);
    if (!customer.favorites.includes(productId)) {
      customer.favorites.push(productId);
    }
  }

  async isFavorite(customerId: CustomerId, productId: ProductId): Promise<boolean> {
    const customer = this.findCustomer(customerId);
    return customer.favorites.includes(productId);
  }

  async getFavorites(customerId: CustomerId): Promise<Array<ProductId>> {
    const customer = this.findCustomer(customerId);
    return customer.favorites;
  }

  async removeFavorite(customerId: CustomerId, productId: ProductId): Promise<void> {
    const customer = this.findCustomer(customerId);
    customer.favorites = customer.favorites.filter((favorite) => favorite !== productId);
  }

  async purgeFavorite(productId: ProductId): Promise<void> {
    for (const customer of CustomerRepository.customers) {
      if (customer.favorites.includes(productId)) {
        customer.favorites = customer.favorites.filter((favorite) => favorite !== productId);
      }
    }
  }

  private findCustomer(customerId: CustomerId): Customer {
    const customer = CustomerRepository.customers.find((customer) => customer.customerId === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }
}
